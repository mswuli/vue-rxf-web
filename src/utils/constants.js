export function getConstants() {
  return {
    // 图片服务器
    IMAGE_UPLOAD_URL: process.env.BASE_API_RXF + '/file/imgUpload',
    IMAGE_URL: process.env.BASE_API_IMG,
    // 附件服务器
    ATTACHMENT_UPLOAD_URL: process.env.BASE_API_RXF + '/file/attachmentUpload',
    ATTACHMENT_URL: process.env.BASE_API_ATTACHMENT,
    IMPORT_GOODS_URL: process.env.BASE_API_RXF + '/business/pharmacy/pharmacyItemInfo/import/',
    HSPSKUREL_UPLOAD_URL: process.env.BASE_API_RXF + '/business/hospital/hspSkuRel/import',

    //电子病历图片上传地址
    ATTACHMENT_UPLOAD_URL_TT: process.env.BASE_API_IMG_TT + '/business/file/attachment/RXF-WEB/1110013095570313217',
    ATTACHMENT_URL_TT:process.env.BASE_API_IMG_TT
  }
}
