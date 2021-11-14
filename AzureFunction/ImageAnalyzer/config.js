const config = {
    endpoint: "COSMOS DB ENDPOINT",
    key: "COSMOS DB KEY",
    databaseId: "analyzedimages",
    containerId: "images",
    partitionKey: { kind: "Hash", paths: ["/name"] },
    visionEndpoint: "COMPUTER VISION ENDPOINT",
    visionKey: "COMPUTER VISION KEY",
    storageEndpoint: "ENDPOINT"
    // Так же обязательно в веб функции нужно будет добавить строку подлюкчения к storage с названием arseniistorage_STORAGE(или другим если поменять его в function.json)
  };
  
module.exports = config;