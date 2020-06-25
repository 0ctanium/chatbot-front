import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { fadeIn, fadeInOut } from '../animation';
import { NgxRasaWebchatService } from '../ngx-rasa-webchat.service';
import { MessageType } from '../message-type.enum';

// const rand = max => Math.floor(Math.random() * max);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-rasa-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css'],
  animations: [fadeInOut, fadeIn]
})
export class ChatWidgetComponent implements OnInit {
  @ViewChild('bottom') bottom: ElementRef;
  @Input() public botName = 'Bot';
  @Input() public botSubtitle = 'Bot';
  @Input() public botDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  @Input() public botAvatar = `https://cdn.dribbble.com/users/275794/screenshots/3128598/gbot_800.png`;
  @Input() public companyLogo = `https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Logo_Minist%C3%A8re_des_Arm%C3%A9es_%282020%29.svg/520px-Logo_Minist%C3%A8re_des_Arm%C3%A9es_%282020%29.svg.png`;
  @Input() public userAvatar = `https://storage.proboards.com/6172192/images/gKhXFw_5W0SD4nwuMev1.png`;
  @Input() public socketUrl = 'http://localhost:5500';
  @Input() public socketPath = '/socket.io/';
  @Input() public initPayload = '/get_started';
  @Input() public inputPlaceholder = 'Tapez votre message ...';
  @Input() public botColor = '#6E91F0';
  @Input() public userColor = '#EBECEF';
  @Input() public embedded = true;
  @Input() public storage = 'session';

  private _visible = false;
  public messageType = MessageType;

  constructor(public chatService: NgxRasaWebchatService) {
  }

  public get visible() {
    return this._visible;
  }

  @Input()
  public set visible(visible) {
    this._visible = visible;
    if (this._visible) {
      setTimeout(() => {
        this.scrollToBottom();
        this.focusMessage();
      }, 0);
    }
  }

  public focus = new Subject();

  public operator;

  public client;

  public messages = [];

  public addMessage(text: string, type: MessageType, from: 'received' | 'sent', quick_replies: [] = null) {
    const message = {
      text,
      type,
      from,
      quick_replies,
      date: new Date().getTime(),
    };
    this.messages.unshift(message);
    this.chatService.storeConversation(this.messages);
    this.scrollToBottom();
  }

  public scrollToBottom() {
    if (this.bottom !== undefined) {
      this.bottom.nativeElement.scrollIntoView();
    }
  }

  public focusMessage() {
    this.focus.next(true);
  }

  ngOnInit() {
    this.chatService.setStorage(this.storage);
    this.messages = this.chatService.getConversation();
    this.chatService.connect(this.socketUrl, this.socketPath, this.initPayload);
    if (this.embedded) {
      this.visible = true;
    }

    this.client = {
      name: 'Guest User',
      status: 'online',
      avatar: this.userAvatar,
    };

    this.operator = {
      name: this.botName,
      status: 'online',
      avatar: this.botAvatar,
    };
    this.chatService
      .getMessages()
      .subscribe((message) => {
        setTimeout(() => {
          console.log(message);
          if (message.text && (!message.quick_replies || message.quick_replies.length < 1)) {
            this.addMessage(message.text, MessageType.text, 'received');
          } else if (message.text && message.quick_replies && message.quick_replies.length > 0) {
            this.addMessage(message.text, MessageType.quick_reply, 'received', message.quick_replies);
          } else if (message.attachment) {
            this.addMessage(message.attachment?.payload?.src, MessageType.image, 'received');
          }
        }, 1000);
      });
  }

  public toggleChat() {
    this.visible = !this.visible;
  }

  public sendMessage({message, type}) {
    if (message.trim() === '') {
      return;
    }
    this.addMessage(message, type, 'sent');
    this.chatService.sendMessage(message);
  }

  quickReplyClick(payload: string) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (!!pattern.test(payload)) {
      window.open(payload, '_blank');
    } else {
      this.chatService.sendMessage(`/${payload}`);
    }
  }

  isFirstMessage(previousMessage, from): boolean {
    if (!previousMessage) {
      return true;
    }
    return previousMessage.from !== from;
  }

  isLastMessage(nextMessage, from): boolean {
    if (!nextMessage) {
      return true;
    }
    return nextMessage.from !== from;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === '/') {
      this.focusMessage();
    }
    if (event.key === '?' && !this._visible) {
      this.toggleChat();
    }
  }
}
