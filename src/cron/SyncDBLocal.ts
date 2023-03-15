import cron from "node-cron";
import { localDB, remoteDB } from "../server";

function SyncDb() {
    try {
        const sync = localDB.replicate.to(remoteDB);
        sync.on('error', (error) => console.error(error));
        sync.on('complete', () => {
            console.log('Sincronizado')
        })
      } catch (error) {
        console.error(error);
      }
}

const syncRemote = cron.schedule('* * */2 * * *', SyncDb, {
    scheduled: false
})

export {syncRemote}    