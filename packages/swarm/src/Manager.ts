export type ManagerParams = {
  
}

export class Manager {

  private nodes: Worker[] = [];

  public broadcast(payload: any) {
  }

  public registerNode(node: Worker) {
    this.nodes.push(node);
  }

}
