const { endpoint, key, databaseId, containerId, partitionKey, visionEndpoint, visionKey, storageEndpoint } = require('./config');
const CosmosClient = require("@azure/cosmos").CosmosClient;
const fetch = require('node-fetch');

module.exports = async function (context, message) {

    //Анализ картинки
    let response = await fetch(visionEndpoint + 'vision/v3.1/analyze?visualFeatures=tags', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': visionKey
        },
        body: JSON.stringify({url: storageEndpoint + 'aiimages/' + message})
    });

    //Добавление картинки с её тегами в БД
    if (response.ok) {
        //Подключение к БД
        const client = new CosmosClient({endpoint, key});

        const { database } = await client.databases.createIfNotExists({
        id: databaseId
        });
    
        const { container } = await client
        .database(databaseId)
        .containers.createIfNotExists(
            { id: containerId, partitionKey },
            { offerThroughput: 400 }
        );

        let result = await response.json();

        const image = {
            name: message,
            tags: result.tags,
            link: storageEndpoint + 'aiimages/' + message
        }
        container.items.create(image);
    } else {
        context.log('HTTP Error ' + response.status + ': ' + response.statusText);
    }

    context.done();
};