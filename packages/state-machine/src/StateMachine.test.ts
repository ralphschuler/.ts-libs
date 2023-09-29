import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { IStateConfig } from "./interfaces/IStateConfig";
import { StateMachine } from "./StateMachine";
import { Merge } from "./types/Merge";

describe("StateMachine", async () => {
  // Define the example states, events, and payloads
  type ExampleStates = {
    IDLE: {};
    PROCESS: { data: number };
    ERROR: { error: string };
  };
  type ExampleEvents = {
    START: {};
    ON_ERROR: {};
    COMPLETE: {};
  }
  type ExamplePayloads = Merge<[ExampleStates, ExampleEvents]>;

  const stateConfig: Record<
    keyof ExampleStates,
    IStateConfig<ExampleStates, ExampleEvents, ExamplePayloads, any>
  > = {
    IDLE: {
      on: {
        START: {
          target: "PROCESS",
        },
      },
    },
    PROCESS: {
      on: {
        COMPLETE: {
          target: "IDLE",
        },
      },
    },
    ERROR: {
      on: {},
    },
  };

  it("should transition states with payload", async () => {
    const stateMachine = new StateMachine<
      ExampleStates,
      ExampleEvents,
      ExamplePayloads
    >("IDLE", stateConfig);

    const payload = { data: 42 };
    await stateMachine.transition("START", payload);

    assert.strictEqual(stateMachine.getCurrentState(), "PROCESS");
  });

  it("should notify state change observers", async () => {
    const stateMachine = new StateMachine<
      ExampleStates,
      ExampleEvents,
      ExamplePayloads
    >("IDLE", stateConfig);
    const observer = (
      state: keyof ExampleStates,
      previousState: keyof ExampleStates,
      payload: ExamplePayloads[keyof ExamplePayloads]
    ) => {
      assert.notStrictEqual(state, previousState);
    };

    stateMachine.subscribe(observer);
    await stateMachine.transition("START");
  });

  it("should handle sub-machine transitions", async () => {
    type SubMachineStates = {
      IDLE: {};
      PROCESS: {};
    };
    type SubMachineEvents = {
      COMPLETE: {};
      START: {};
    };
    type SubMachinePayloads = Merge<[SubMachineStates, SubMachineEvents]>;

    const subStateConfig: Record<
      keyof SubMachineStates,
      IStateConfig<SubMachineStates, SubMachineEvents, SubMachinePayloads, any>
    > = {
      IDLE: {
        on: {
          COMPLETE: {
            target: "PROCESS",
          },
        },
      },
      PROCESS: {
        on: {
          START: {
            target: "IDLE",
          },
        },
      },
    };

    const stateConfigWithSubMachine: Record<
      keyof ExampleStates,
      IStateConfig<ExampleStates, ExampleEvents, ExamplePayloads, SubMachineEvents>
    > = {
      IDLE: {
        on: {
          START: {
            target: "PROCESS",
          },
        },
        subMachine: new StateMachine<any, SubMachineEvents, any>("IDLE", subStateConfig),
      },
      PROCESS: {
        on: {
          COMPLETE: {
            target: "IDLE",
          },
        },
      },
      ERROR: {
        on: {},
      },
    };

    const stateMachine = new StateMachine<
      ExampleStates,
      ExampleEvents,
      ExamplePayloads
    >("IDLE", stateConfigWithSubMachine);

    await stateMachine.transition("START");
    assert.strictEqual(stateMachine.getCurrentState(), "PROCESS");

    await stateMachine.transition("COMPLETE");
    assert.strictEqual(stateMachine.getCurrentState(), "IDLE");
  });

  it("should handle sub-machine transitions with payload", async () => {
    
    type SubMachineStates = {
      IDLE: {};
      PROCESS: {};
    };
    type SubMachineEvents = {
      COMPLETE: {};
      START: {};
    };
    type SubMachinePayloads = Merge<[SubMachineStates, SubMachineEvents]>;

    const subStateConfig: Record<
      keyof SubMachineStates,
      IStateConfig<SubMachineStates, SubMachineEvents, SubMachinePayloads, any>
    > = {
      IDLE: {
        on: {
          COMPLETE: {
            target: "PROCESS",
          },
        },
      },
      PROCESS: {
        on: {
          START: {
            target: "IDLE",
          },
        },
      },
    };

    const stateConfigWithSubMachine: Record<
      keyof ExampleStates,
      IStateConfig<ExampleStates, ExampleEvents, ExamplePayloads, SubMachineEvents>
    > = {
      IDLE: {
        on: {
          START: {
            target: "PROCESS",
          },
        },
        subMachine: new StateMachine<any, SubMachineEvents, any>("IDLE", subStateConfig),
      },
      PROCESS: {
        on: {
          COMPLETE: {
            target: "IDLE",
          },
        },
      },
      ERROR: {
        on: {},
      },
    };

    const stateMachine = new StateMachine<
      ExampleStates,
      ExampleEvents,
      ExamplePayloads
    >("IDLE", stateConfigWithSubMachine);

    await stateMachine.transition("START");
    assert.strictEqual(stateMachine.getCurrentState(), "PROCESS");

    await stateMachine.transition("COMPLETE");
    assert.strictEqual(stateMachine.getCurrentState(), "IDLE");
  });

  it("should handle error transition", async () => {
    const errorStateConfig: Record<
      keyof ExampleStates,
      IStateConfig<ExampleStates, ExampleEvents, ExamplePayloads, any>
    > = {
      IDLE: {
        on: {
          START: {
            target: "PROCESS",
            guard: async () => false,
          },
          ERROR: {
            target: "IDLE",
          },
        },
      },
      PROCESS: {
        on: {
          COMPLETE: {
            target: "IDLE",
          },
        },
      },
      ERROR: {
        on: {},
      },
    };

    const stateMachine = new StateMachine<
      ExampleStates,
      ExampleEvents,
      ExamplePayloads
    >("IDLE", errorStateConfig);

    await stateMachine.transition("START");
    assert.strictEqual(stateMachine.getCurrentState(), "PROCESS");

    await stateMachine.transition("UNKOWN_EVENT");
    assert.notStrictEqual(stateMachine.getCurrentState(), "UNKOWN");
  });

  it("should create dynamically", async () => {
    const stateMachine = new StateMachine<
      ExampleStates,
      ExampleEvents,
      ExamplePayloads
    >("IDLE")
      .addTransition("IDLE", "START", "PROCESS", async () => {
      })
      .addTransition("PROCESS", "COMPLETE", "IDLE", async () => {
      })
      .addTransition("IDLE", "ON_ERROR", "ERROR", async () => {
      })
      .addTransition("ERROR", "START", "IDLE", async () => {
      });

    await stateMachine.transition("START");
    assert.strictEqual(stateMachine.getCurrentState(), "PROCESS");

    await stateMachine.transition("COMPLETE");
    assert.strictEqual(stateMachine.getCurrentState(), "IDLE");

    await stateMachine.transition("ON_ERROR");
    assert.strictEqual(stateMachine.getCurrentState(), "ERROR");
  });
});
