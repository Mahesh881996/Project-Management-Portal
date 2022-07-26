import { IAttachmentFileInfo } from "@pnp/sp/attachments/types";

export interface NewFormStates {
    projectName ?: string;
    projectDescription ?: boolean;
    projectManager ?: any;
    projectBA ?: any;
    projectSME ?: any;
    projectDevelopers ?: any;
    expectedStartDate ?: Date;
    expectedEndDate ?: Date;
    fileUpload ?: IAttachmentFileInfo[];
    filePickerResult ?: any;
}
  