import { Controller, Get, Param, Req, Res, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, Subject, interval, map, of } from 'rxjs';
import { Response } from 'express';



interface MessageEvent {
  data: string | object;
}

const userConnections = new Map();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }


  @Get()
  getHello(): string {
    // this.emitEvent("hello")

    return this.appService.getHello();
  }

  @Get("/api/msg")
  sendMsg(): any {
    this.appService.sendNotification("123", { dta: "dsdsds" });
  }

  


  @Get('sse/:userId')
  async streamNotifications(
    @Param('userId') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // if (userId !== '123') {

    //   res.status(403).end();
    //   return;
    // }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');


    const sseStream = this.appService.createSseStream(userId);
    console.log('--->',sseStream);


    sseStream.subscribe((sseEvent) => {
      console.log("pp",sseEvent)
      res.write(`data: ${JSON.stringify(sseEvent)}\n\n`);
    });

    // Handle client disconnection
    
    (req as any).on('close', () => {
      this.appService.removeSseStream(userId);
    });
  }






  // // @Sse("sse")
  // // sendEvent(): Observable<MessageEvent> {
  // //   return interval(2000).pipe(
  // //     map((num: number) => ({
  // //       data: "Hello" + num
  // //     }))
  // //   )
  // // }

  // // @Sse("sse")
  // // sendNotification(): Observable<MessageEvent> {
  // //   return this.eventSubject.asObservable();
  // // }

  // // // Emit an event to all connected clients.
  // // emitEvent(data: any) {
  // //   this.eventSubject.next({ data });
  // // }

  // @Sse('sse/:userId')
  // async sse(@Param('userId') userId: string, @Res() res: Response) {

  //   // console.log("-------->1",userConnections)
  //   // Set up SSE response headers
  //   const isUserAllowed = await this.isUserAllowedToSendNotification(userId);

  //   if (!isUserAllowed) {
  //     res.status(403).end(); // Forbidden
  //     return;
  //   }

  //   res.setHeader('Content-Type', 'text/event-stream');
  //   res.setHeader('Cache-Control', 'no-cache');
  //   res.setHeader('Connection', 'keep-alive');

  //   // Associate the user ID with the SSE response
  //   await userConnections.set(userId, true);
  //   console.log("-------->2", userId,userConnections)


  //   // Handle client disconnect
  //   res.on('close', () => {
  //     userConnections.delete(userId);
  //   });
  //   if(userId==="123"){
  //     return of('data: this is for 123 user\n\n');

  //   }
  //   return of('data: null\n\n');


  // }
  // // This function should be customized to your user verification logic
  // private async isUserAllowedToSendNotification(userId: string): Promise<boolean> {
  //   // Example: Check if the userId is 123
  //   return userId === '123';
  // }


}
