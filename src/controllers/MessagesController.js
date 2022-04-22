module.exports = class Message {
  constructor(client) {
    this.client = client;
  }

  // BEGIN:: GETTERS AND SETTERS
  setClient(client){ this.client = client; }
  getClient(){ return this.client; }
  // END:: GETTERS AND SETTERS
  async sendMessage(request, response) {
    const { chat_id, text } = request.body;

    let data = await this.getChatById(chat_id);
    if(!data.result) return response.status(500).json(data.response);

    let chat = data.response;

    try{
      let result = await chat.sendMessage(chat_id, text);
      return response.status(201).json(result);
    }catch(erro){
      console.log(erro);
      return response.json(erro);
    }
  }
  async getChats(request, response) {
    try{
      let result = await this.client?.getChats();
      return response.status(201).json(result);
    }catch(erro){
      console.error('Error when sending: ', erro);
      return response.json(erro);
    }
  }
  // async getMessages(request, response) {
  //   const { chat_id } = request.params;
  //   this.client?.getAllMessagesInChat(chat_id).then(async (result) => {
  //     // if(!Array.isArray(result))
  //     return response.status(201).json(result);

  //     // const unresolvedPromises = result.map((message) => {
  //     //   return this.handleFile(message);
  //     // })
  //     // const data = await Promise.all(unresolvedPromises);

  //     // return response.status(201).json(data);
  //   }).catch((erro) => {
  //     console.error('Error when sending: ', erro); //return object error
  //     return response.json(erro);
  //   });
  // }
  // async getChatGroupNewMsg(request, response) {
  //   this.client?.getChatGroupNewMsg().then((result) => {
  //     return response.status(201).json(result);
  //   }).catch((erro) => {
  //     console.error('Error when sending: ', erro); //return object error
  //     return response.json(erro);
  //   });
  // }
  // async getAllUnreadMessages(request, response) {
  //   this.client?.getAllUnreadMessages().then((result) => {
  //     return response.status(201).json(result);
  //   }).catch((erro) => {
  //     console.error('Error when sending: ', erro); //return object error
  //     return response.json(erro);
  //   });
  // }
  // async getAllChatsGroups(request, response) {
  //   this.client?.getAllChatsGroups().then((result) => {
  //     return response.status(201).json(result);
  //   }).catch((erro) => {
  //     console.error('Error when sending: ', erro); //return object error
  //     return response.json(erro);
  //   });
  // }
  // async checkNumberStatus(request, response) {
  //   const { phone } = request.params;
  //   this.client?.checkNumberStatus(phone).then((result) => {
  //     return response.status(201).json(result);
  //   }).catch((erro) => {
  //     console.error('Error when sending: ', erro); //return object error
  //     return response.json(erro);
  //   });
  // }
  // async getNumberProfile(request, response) {
  //   const { phone } = request.params;
  //   this.client?.getNumberProfile(phone).then((result) => {
  //     return response.status(201).json(result);
  //   }).catch((erro) => {
  //     console.error('Error when sending: ', erro); //return object error
  //     return response.json(erro);
  //   });
  // }
  // async sendSeen(request, response) {
  //   const { chat_id } = request.params;
  //   this.client?.sendSeen(chat_id).then((result) => {
  //     return response.status(201).json(result);
  //   }).catch((erro) => {
  //     console.error('Error when sending: ', erro); //return object error
  //     return response.json(erro);
  //   });
  // }
  // // =====================================================
  // async createGroup(request, response) {
  //   const { group_name, contacts } = request.body;
  //   this.client?.createGroup(group_name, contacts).then((result) => {
  //     return response.status(201).json(result);
  //     // result['gid']['_serialized']
  //   }).catch((erro) => {
  //     console.error('Error when sending: ', erro); //return object error
  //     return response.json(erro);
  //   });
  // }
  async addMember(request, response) {
    const { group_id, member_id } = request.body;

    let data = await this.getChatById(group_id);
    if(!data.result) return response.status(500).json(data.response);

    let chat = data.response;

    try{
      let result = await chat.addParticipants([member_id]);
      return response.status(201).json(result);
    }catch(erro){
      console.error('Error when sending: ', erro); //return object error
      return response.json(erro);
    }
  }
  async removeMember(request, response) {
    const { group_id, member_id } = request.body;

    let data = await this.getChatById(group_id);
    if(!data.result) return response.status(500).json(data.response);

    let chat = data.response;

    try{
      let result = await chat.removeParticipants([member_id]);
      return response.status(201).json(result);
    }catch(erro) {
      console.error('Error when sending: ', erro); //return object error
      return response.json(erro);
    }
  }
  async promoteMember(request, response) {
    const { group_id, member_id } = request.body;

    let data = await this.getChatById(group_id);
    if(!data.result) return response.status(500).json(data.response);

    let chat = data.response;

    try{
      let result = await chat.promoteParticipants([member_id]);
      return response.status(201).json(result);
    }catch(erro) {
      console.error('Error when sending: ', erro); //return object error
      return response.json(erro);
    }
  }
  async demoteMember(request, response) {
    const { group_id, member_id } = request.body;

    let data = await this.getChatById(group_id);
    if(!data.result) return response.status(500).json(data.response);

    let chat = data.response;

    try{
      let result = await chat.demoteParticipants([member_id]);
      return response.status(201).json(result);
    }catch(erro) {
      console.error('Error when sending: ', erro); //return object error
      return response.json(erro);
    }
  }
  async setGroupDescription(request, response) {
    const { group_id, description } = request.body;

    let data = await this.getChatById(group_id);
    if(!data.result) return response.status(500).json(data.response);

    let chat = data.response;

    try{
      let result = await chat.setDescription(description);
      return response.status(201).json(result);
    }catch(erro) {
      console.error('Error when sending: ', erro); //return object error
      return response.json(erro);
    }
  }
  async setGroupReadonly(request, response){
    const { group_id } = request.body;

    let data = await this.getChatById(group_id);
    if(!data.result) return response.status(500).json(data.response);

    let chat = data.response;

    try{
      let result = await chat.setMessagesAdminsOnly(true);
      return response.status(201).json(result);
    }catch(erro){
      console.error('Error when sending: ', erro); //return object error
      return response.json(erro);
    }
  }
  async setGroupReadwrite(request, response){
    const { group_id } = request.body;

    let data = await this.getChatById(group_id);
    if(!data.result) return response.status(500).json(data.response);

    let chat = data.response;

    try{
      let result = await chat.setMessagesAdminsOnly(false);
      return response.status(201).json(result);
    }catch(erro){
      console.error('Error when sending: ', erro); //return object error
      return response.json(erro);
    }
  }
  // async setGroupImage(request, response) {
  //   const { group_id, image_path } = request.body;

  //   console.log(':: set-group-image')
  //   console.log('req >>', group_id, image_path);
  //   this.client?.setGroupImage(group_id, image_path).then((result) => {
  //     console.log('res >>', result);
  //     return response.status(201).json(result);
  //   }).catch((erro) => {
  //     console.error('Error when sending: ', erro); //return object error
  //     return response.json(erro);
  //   });
  // }
  // async setGroupSettings(request, response) {
  //   const { group_id, settings, value } = request.body;
  //   // ANNOUNCEMENT: = "announcement"
  //   this.client?.setGroupSettings(group_id, settings, value).then((result) => {
  //     return response.status(201).json(result);
  //   }).catch((erro) => {
  //     console.error('Error when sending: ', erro); //return object error
  //     return response.json(erro);
  //   });
  // }
  // // LOCAL FUNCTIONS
  // async handleFile(request, response){
  //   const { message } = request.body;
  //   if (message.isMedia === true || message.isMMS === true) {
  //     const buffer = await this.client?.decryptFile(message);

  //     return response.status(201).json({
  //       result: true,
  //       response: buffer.toString('base64')
  //     });
  //   }
  //   return response.status(201).json({
  //     result: false,
  //     response: 'is not file'
  //   });
  // } 

  // LOCAL FUNCTIONS ================================
  async getChatById(chat_id){
    try{
      const response = await this.client.getChatById(chat_id);
      return {
        result: true,
        response
      }
    }catch(e){
      return {
        result: false,
        response: "Chat não encontrado"
      }
    }
  }
}