class Strore{
  constructor(storageApi){
    this.api = storageApi;
  }

  get(){
    return this.api.getItem(this.key);
  }

  set(value){
    this.api.setItem(this.key, value)
  }
}
