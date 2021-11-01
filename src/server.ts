import dgram from "dgram";

export default class Server{
    public server:dgram.Socket;

    constructor(){
        this.server = dgram.createSocket("udp4");
    }

}