const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const fs = require('fs');
const classMessagesController = require('./MessagesController');

module.exports = class Whatsapp {
  constructor(app, io) {  
    this.app = app;
    this.io = io;
    this.client = null;
    this.socket = null;
    this.status = null;    
    this.messagesController = new classMessagesController(this.client);
    this.session = 'Chatinger';

    this.io.on('connection', (socket) => {
      console.log(`Socket connected ${socket.id}`);
      this.socket = socket;

      if(this.status) this.socket?.emit('status', this.status);
      else this.socket?.emit('status', {
        status: null,
        message: `(${this.session}) Aguardando conexão`
      });

      this.socket?.emit('tokens', fs.readdirSync('./.wwebjs_auth'));
    });

    this.whatsappWebJsCreate();

    this.routes();
  }

  async whatsappWebJsCreate(){
    console.log('creating...');
    this.socket?.emit('status', {
      status: null,
      message: `(${this.session}) Aguardando conexão`
    });

    this.client = new Client({
      authStrategy: new LocalAuth(),
    });
    
    this.client.on('qr', qr => {
      qrcode.generate(qr, {small: true});

      this.socket?.emit('status',{
        status: null,
        message: `(${this.session}) Escaneie o QRCode`
      });

      this.socket?.emit('qrcode',{
        base64: qr
      });
    });
    
    this.client.on('ready', async () => {
      console.log('Client is ready!');

      this.status = {
        status: 'isLogged',
        message: `(${this.session}) Conectado`
      };
      this.socket?.emit('status', this.status);

      this.whatsappWebJsStart();
      console.log("whatsapp-web.js started!\nServer Listening...");
    });
    
    this.client.on('authenticated', () => console.log('is authenticated'));

    this.client.initialize();
    
    console.log('intializing...');
  }
  // END:: STATING WHATSAPP-WEB-JS | BEGIN:: INIT SOCKET
  routes(){
    console.log('routes started!');
    // this.app.get('/saved-token/delete/:token_name', (req, res) => {
    //   const { token_name } = req.params;
    //   try{
    //     fs.unlinkSync(`./.wwebjs_auth/${token_name}`);

    //     this.socket?.emit('tokens', fs.readdirSync('./.wwebjs_auth'));
    //     this.whatsappWebJsCreate();

    //     return res.status(201).json({
    //       result: true,
    //       response: 'Token excluído'
    //     });
    //   }catch(e){
    //     return res.status(500).json({
    //       result: false,
    //       response: 'Houve um erro ao excluir token'
    //     });
    //   }
    // });
    // this.app.get('/change-session/:session_name', async (req, res) => {
    //   try{
    //     const { session_name } = req.params;

    //     if(session_name === this.session) return res.status(201).json({
    //       result: true,
    //       response: 'Sessão já está ativa'
    //     });
        
        
    //     const response = this.setSessionName(session_name);        
    //     if(!response) return res.status(500).json({
    //       result: false,
    //       response: 'Não foi possível salvar a nova sessão'
    //     });

    //     this.session = response;

    //     if(this.client){
    //       console.log('Encerrando sessão anterior...');
    //       await this.client.close();
    //     }

    //     this.whatsappWebJsCreate();
    //     return res.status(201).json({
    //       result: true,
    //       response: 'Sessão alterada'
    //     });
    //   }catch(e){
    //     return res.status(500).json({
    //       result: false,
    //       response: 'Houve um erro ao alterar a sessão'
    //     });
    //   }
    // });

    this.app.get('/test', (req, res) => { return res.json('Teste de requisição'); })
    this.app.get('/get-chats', (req, res) => {  
      return this.verifyClient(() => this.messagesController.getChats(req, res), res);
    });
    // this.app.get('/get-chats-groups', (req, res) => {
    //   return this.verifyClient(() => this.messagesController.getAllChatsGroups(req, res), res);
    // });
    // this.app.get('/get-chats-groups-new-messages', (req, res) => {
    //   return this.verifyClient(() => this.messagesController.getChatGroupNewMsg(req, res), res);
    // });
    // this.app.get('/get-all-unread-messages', (req, res) => {
    //   return this.verifyClient(() => this.messagesController.getAllUnreadMessages(req, res), res);
    // });
    // this.app.get('/get-messages/:chat_id', (req, res) => {
    //   return this.verifyClient(() => this.messagesController.getMessages(req, res), res);
    // });
    // this.app.get('/check-number/:phone', (req, res) => {
    //   return this.verifyClient(() => this.messagesController.checkNumberStatus(req, res), res);
    // });
    // this.app.get('/send-seen/:chat_id', (req, res) => {
    //   return this.verifyClient(() => this.messagesController.sendSeen(req, res), res);
    // });
  
    this.app.post('/send-message', (req, res) => {
      return this.verifyClient(() => this.messagesController.sendMessage(req, res), res);
    });
    // this.app.post('/create-group', (req, res) => {
    //   return this.verifyClient(() => this.messagesController.createGroup(req, res), res);
    // });
    this.app.post('/add-member', (req, res) => {
      return this.verifyClient(() => this.messagesController.addMember(req, res), res);
    });
    this.app.post('/remove-member', (req, res) => {
      return this.verifyClient(() => this.messagesController.removeMember(req, res), res);
    });
    this.app.post('/promote-member', (req, res) => {
      return this.verifyClient(() => this.messagesController.promoteMember(req, res), res);
    });
    this.app.post('/demote-member', (req, res) => {
      return this.verifyClient(() => this.messagesController.demoteMember(req, res), res);
    });
    this.app.post('/change-group-readonly', (req, res) => {
      return this.verifyClient(() => this.messagesController.setGroupReadonly(req, res), res);
    });
    this.app.post('/change-group-readwrite', (req, res) => {
      return this.verifyClient(() => this.messagesController.setGroupReadwrite(req, res), res);
    });
    this.app.post('/change-group-description', (req, res) => {
      return this.verifyClient(() => this.messagesController.setGroupDescription(req, res), res);
    });
    // this.app.post('/change-group-image', (req, res) => {
    //   return this.verifyClient(() => this.messagesController.setGroupImage(req, res), res);
    // });  
    // this.app.get('/get-number-profile/:phone', (req, res) => {
    //   return this.verifyClient(() => this.messagesController.getNumberProfile(req, res), res);
    // });
  
    // this.app.post('/handle-file', (req, res) => {
    //   return this.verifyClient(() => this.messagesController.handleFile(req, res), res);
    // });
  }
  whatsappWebJsStart(){
    console.log('started...');

    this.messagesController.setClient(this.client);
    this.socket?.emit('tokens', fs.readdirSync('./.wwebjs_auth'));
    this.socket?.emit('status', {
      status: true,
      message: `(${this.session}) Conectado`
    });
  }
  verifyClient(callback, res){
    // if(!this.client) return res.json({
    //   result: false,
    //   response: 'Whatsapp Desconectado'
    // });

    return callback();
  }
  getSessionName(){
    let response = "";
    try{
      response = fs.readFileSync('session_name.txt', 'utf-8');
    }catch(e){
      response = this.setSessionName();
    }
    return response;
  }
  setSessionName(name = 'chatinger'){
    try{
      fs.writeFileSync('session_name.txt', name);
      return name;
    }catch(e){ return null; }
  }
}