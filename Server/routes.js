const Router = require('express');
const router = new Router();
const uuid = require('uuid');
const { BlobServiceClient } = require('@azure/storage-blob');
const { QueueClient, QueueServiceClient } = require("@azure/storage-queue");
const CosmosClient = require("@azure/cosmos").CosmosClient;
const {storageConnStr, DbEndpoint, DbKey, databaseId, containerId, partitionKey} = require('./setting');

router.post('/upload', upload);
router.get('/images', getImages);
router.get('/filteredImages', getFilteredImages);
router.get('/tags', getTags)

async function upload(req, res) {
    const service = BlobServiceClient.fromConnectionString(storageConnStr);
    const client = service.getContainerClient('aiimages');
    client.setAccessPolicy('blob');
    const {succeeded} = await client.createIfNotExists('aiimages');

    if(!req.files) {
        return res.status(400).json({message: 'File not found'});
    }
    const {file} = req.files;
    let blobName = uuid.v4() + '.jpg';

    const blobClient = client.getBlockBlobClient(blobName);
    const uploadRes = await blobClient.upload(file.data, file.size);

    const queueServiceClient = QueueServiceClient.fromConnectionString(storageConnStr);
    const queueClient = queueServiceClient.getQueueClient('analyze');
    await queueClient.createIfNotExists();
    await queueClient.sendMessage(Buffer.from(blobName, 'utf8').toString('base64'));

    res.json(uploadRes);
}

async function getImages(req, res) {
    const client = new CosmosClient({endpoint: DbEndpoint, key:DbKey});

    const { database } = await client.databases.createIfNotExists({
        id: databaseId
    });

    const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
        { id: containerId, partitionKey },
        { offerThroughput: 400 }
    );

    const { resources: images } = await container.items.query('SELECT * FROM c').fetchAll();
    res.json(images);
}

async function getFilteredImages(req, res) {
    const {tag} = req.query;
    if(tag) {
        const client = new CosmosClient({endpoint: DbEndpoint, key:DbKey});

        const { database } = await client.databases.createIfNotExists({
            id: databaseId
        });
    
        const { container } = await client
        .database(databaseId)
        .containers.createIfNotExists(
            { id: containerId, partitionKey },
            { offerThroughput: 400 }
        );
    
        const { resources: images } = await container.items.query(`SELECT VALUE c FROM c JOIN t in c.tags WHERE t.name = "${tag}"`).fetchAll();
        res.json(images);
    } else {
        res.status(404).json({message: 'Tag not found'});
    }
}

async function getTags(req, res) {
    const client = new CosmosClient({endpoint: DbEndpoint, key:DbKey});

    const { database } = await client.databases.createIfNotExists({
        id: databaseId
    });

    const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
        { id: containerId, partitionKey },
        { offerThroughput: 400 }
    );

    const { resources: images } = await container.items.query('SELECT DISTINCT c.name FROM c IN t.tags').fetchAll();
    res.json(images);
}

module.exports = router;