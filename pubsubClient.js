const {PubSub} = require('@google-cloud/pubsub');
const {GoogleAuth} = require('google-auth-library');

function run(projectId = 'bri-tcd-prod', topicId = 'log-stream-to-bq-dev', subId = 'log-stream-to-bq-dev-sub', timeout=60){

    // async function main() {
    //     const auth = new GoogleAuth({
    //       scopes: 'https://www.googleapis.com/auth/cloud-platform'
    //     });
    //     const client = await auth.getClient();
    //     const projectId = await auth.getProjectId();
    //     const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
    //     const res = await client.request({ url });
    //     console.log(res.data);
    //   }

    // main().catch(console.error);

    const pubsub = new PubSub({projectId});

    const subscription = pubsub.subscription(subId);

    let messageCount = 0;
    const messageHandler = message => {
        console.log(`Received message ${message.id}:`);
        console.log(`\tData: ${message.data}`);
        console.log(`\tAttributes: ${message.attributes}`);
        messageCount += 1;

        message.ack();
    };

    subscription.on('message', messageHandler);

    setTimeout(() => {
        subscription.removeListener('message', messageHandler);
        console.log(`${messageCount} message(s) received`);
    }, timeout * 1000);
}

run();