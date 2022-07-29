import os, { NetworkInterfaceInfo } from "os"

export class NetUtils {
    public static getIPv4Info(): NetworkInterfaceInfo | undefined {
        var networkInterfaces = os.networkInterfaces();
        return Object.entries(networkInterfaces)
          .map((el) => el[1])
          .flat()
          .filter((el) => el.family === "IPv4").find((el) => {
            return el.address !== "127.0.0.1" && el.address !== "localhost";
          })
    }

    public static getMyLocalIPv4CIDR(): string | null {
            const IPv4Info = NetUtils.getIPv4Info()
            if(!IPv4Info){
                throw new Error()
            }
            return IPv4Info.cidr;
      };

      public static getMyLocalIPv4(): string{
        return NetUtils.getMyLocalIPv4CIDR()?.split("/")[0] ?? ""
      }

      public static getMyLocalIPv4Mask(): string{
        return NetUtils.getMyLocalIPv4CIDR()?.split("/")[1] ?? ""
      }
      
    public static getBroadcastIPv4(): string {
        const IPv4Info = NetUtils.getIPv4Info()
        if(!IPv4Info){
            throw new Error()
        }
        var addr_splitted = IPv4Info.address.split('.');
        var netmask_splitted = IPv4Info.netmask.split('.');
        return addr_splitted.map((e:any, i:any) => (~netmask_splitted[i] & 0xFF) | e).join('.');
      };
}