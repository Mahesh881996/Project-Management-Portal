import { WebPartContext } from "@microsoft/sp-webpart-base";

// import pnp and pnp logging system
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import "@pnp/sp/attachments";
import "@pnp/sp/lists/web";
import { IItemAddResult, IItems, Item } from "@pnp/sp/items";
import { IList } from "@pnp/sp/lists";
import "@pnp/sp/site-users/web";
import { IAttachmentFileInfo } from "@pnp/sp/attachments";

var _sp: SPFI = null;

export const getSP = (context?: WebPartContext): SPFI => {
  if (_sp === null && context != null) {
    //You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
    // The LogLevel set's at what level a message will be written to the console
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  }
  return _sp;
};

export const createListItem = async (listName: string, body: any,files?:IAttachmentFileInfo[]) => {
  let spcontext: SPFI = getSP();

  try {
    let createdItem = await spcontext.web.lists
      .getByTitle(listName)
      .items
      .add(body).then(async r=>{
        if(files){
          await addAttachments(files,r.data.ID,listName);
        }
      });
    return createdItem;
  }
  catch (err) {
    Promise.reject(err);
  }
}

export const ensureUser = async (loginName: string) => {
  let spcontext: SPFI = getSP();
  try {
    let userDetails = await spcontext.web.ensureUser(loginName);
    return userDetails;
  }
  catch (err) {
    Promise.reject(err);
  }
}

export const addAttachments = async(files:IAttachmentFileInfo[],itemId:number,listName:string) => {
  let spcontext: SPFI = getSP();
  const item = await spcontext.web.lists.getByTitle(listName).items.getById(itemId);
  const [batchedSP, execute] = spcontext.batched();
  files.map((file) => {
    const files = item.attachmentFiles.add( file.name, file.content );
  })
  await execute();
}

export const getListItems = async(listName: string,select: string,lookup:string) => {
  let spcontext: SPFI = getSP();
  try{
    let allItems = await spcontext.web.lists.getByTitle(listName).items.select(select).expand(lookup).top(5000)();
    return allItems;
  }
  catch (err) {
    Promise.reject(err);
  }
  
}