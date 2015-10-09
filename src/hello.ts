import {Component, View, NgFor, NgIf, ElementRef, Inject, Pipe, SlicePipe} from 'angular2/angular2';
import {Http, HTTP_BINDINGS} from "angular2/http";
import {bootstrap} from 'angular2/angular2';

@Pipe({
    name: 'ts'
})
// The work of the pipe is handled in the tranform method with our pipe's class
class TSPipe {
    transform(value:number, args:any[]) {
        var formattedTime:number = parseInt((value * 1000).toString());
        var format = 'DD MMM YYYY';
        if (args[0]) {
            format = args[0];
        }

        return moment(formattedTime).format(format);
    }
}


@Component({selector: 'tw-app'})
@View({
    directives: [NgIf, NgFor],
    pipes: [TSPipe, SlicePipe],
    template: `
    <div *ng-if="config">
    <p *ng-for="#message of messages">
        <span>{{message.username}}, {{message.ts|ts}}</span>: {{message.text|slice:0:20}}
    </p>
    </div>`
})
export class TWApp {
    config:Object;
    messages:Object[];

    constructor(http:Http) {
        http.get('./src/config.json').map(res => res.json()).subscribe(res => {
            this.config = res;
            var service = new SlackService(this.config, http);
            service.check().subscribe(res => {
                if (res.ok) {
                    service.get('channels.history', {channel: "C08MD084E"}).subscribe(res=> {
                        if (res.ok) {
                            this.messages = res.messages;
                            console.log(res);
                        }
                    });
                }
            });
        });
    }
}

class RestService {
    config:Object;
    http:Http;

    constructor(config:Object, http:Http) {
        this.config = config;
        this.http = http;
    }

    private getUrl(url:string, params:Object):string {
        var fullUrl = this.config['url'] + '/' + url + '?token=' + this.config['accessToken'];
        for (var key in params) {
            if (!params.hasOwnProperty(key)) {
                continue;
            }
            console.log(params);
            console.log(params[key]);
            fullUrl += "&" + key + "=" + encodeURI(params[key]);
        }
        return fullUrl;
    }

    get(url:string, params?:Object) {
        var url = this.getUrl(url, params);
        return this.http.get(url).map(res => res.json());
    }

    post(url:string, data:Object) {

    }

    put(url:string, id:any, put:Object) {

    }

    delete(url:string, id:any) {

    }

    createSignature(data:Object):string {
        return '';
    }
}

class SlackService extends RestService {

    constructor(config:Object, http:Http) {
        super(config, http);
    }

    check() {
        return super.get('auth.test');
    }

    get(url:string, params:Object) {
        return super.get(url, params);
    }
}


bootstrap(TWApp, [HTTP_BINDINGS]);