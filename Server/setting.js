module.exports = {
    storageConnStr: "STORAGE CONNECTION STRING",
    DbEndpoint: "COSMOS DB ENDPOINT",
    DbKey: "COSMOS DB KEY",
    databaseId: "analyzedimages",
    containerId: "images",
    partitionKey: { kind: "Hash", paths: ["/name"] },
}