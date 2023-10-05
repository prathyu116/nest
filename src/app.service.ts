import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { RedisService } from './redis.service';


@Injectable()
export class AppService {
  
  private sseStreams = new Map<string, Subject<any>>();
  constructor(private readonly redisService: RedisService) { }


  getHello(): string {
     this.redisService.getClient().set('key', 'Redis data!');

    return 'Hello World!';
  }

   createSseStream(userId: string): Observable<any> {
    // if (!this.sseStreams.has(userId)) {
    //    this.sseStreams.set(userId, new Subject<any>());
    // }
    // console.log("kooi2", this.sseStreams.get(userId))
    // return this.sseStreams.get(userId).asObservable();





    //-----------------------------redis--------------------------------
    const redisClient =  this.redisService.getClient();
    const sseStream =  new Subject<any>();

    // Store the SSE stream in Redis using a unique key (e.g., 'sse_stream_user_123')
    const redisKey = `sse_stream_user_${userId}`;

    // Store the stream as JSON in Redis
     redisClient.set(redisKey, JSON.stringify(sseStream));

    return sseStream.asObservable();
  }

  async sendNotification(userId: string, notification: any) {
    // if (this.sseStreams.has(userId)) {
    //   this.sseStreams.get(userId).next(notification);
    // }
    //-------------------redis------------------------
    const redisClient = this.redisService.getClient();
    const redisKey = `sse_stream_user_${userId}`;

    const sseStreamJson =  await redisClient.get(redisKey);
    if (sseStreamJson) {
      const sseStream = new Subject<any>();
      sseStream.next(notification);
    }
  }

 async removeSseStream(userId: string) {
    // console.log("dlllllllllllll")
    // if (this.sseStreams.has(userId)) {
    //   this.sseStreams.get(userId).complete();
    //   this.sseStreams.delete(userId);
    // }
    // console.log("dlt", this.sseStreams)


    //------------------------redis---------------------------------
    const redisClient = this.redisService.getClient();
    const redisKey = `sse_stream_user_${userId}`;
    await redisClient.del(redisKey);

  }
}
