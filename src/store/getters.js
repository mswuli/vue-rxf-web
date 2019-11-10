const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  isUse: state => state.common.isUse,
  templateInfo: state =>state.templateInfo.templateInfo,
  markingInfo:state=>state.markingInfo.markingInfo,
}
export default getters
