import cron from "node-cron";
import { localDB, remoteDB } from "../server";

function SyncDb() {
    try {
        const sync = remoteDB.replicate.to(localDB);
        sync.on('error', (error) => console.error(error));
        sync.on('complete', () => {
            console.log('Sincronizado')
        })
      } catch (error) {
        console.error(error);
      }
}

const syncLocal = cron.schedule('* * */2 * * *', SyncDb, {
    scheduled: false
})

export {syncLocal}    