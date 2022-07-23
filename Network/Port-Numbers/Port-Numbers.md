# 1 Port numbers





# 2 Port 범위

* Well known ports와 Registered ports는 인터넷 주소 할당기구인 IANA에 등록되어 사용된다
* private ports는 IANA에 등록되지 않으며 이 포트 번호는 자동 할당되거나 사설 용도로 할당되고 클라이언트의 임시 포트 번호로 사용
* Well known ports: `0~1023`
* Registered ports: 1024~49151
* dynamic or private ports: `49152~65535`



## 2.1 Well known port

|  Number  |                          Assignment                          |
| :------: | :----------------------------------------------------------: |
|    20    | [File Transfer Protocol](https://en.wikipedia.org/wiki/File_Transfer_Protocol) (FTP) Data Transfer |
|    21    | [File Transfer Protocol](https://en.wikipedia.org/wiki/File_Transfer_Protocol) (FTP) Command Control |
|    22    | [Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell) (SSH) Secure Login |
|    23    | [Telnet](https://en.wikipedia.org/wiki/Telnet) remote login service, unencrypted text messages |
|    25    | [Simple Mail Transfer Protocol](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) (SMTP) email delivery |
|    53    | [Domain Name System](https://en.wikipedia.org/wiki/Domain_Name_System) (DNS) service |
|  67, 68  | [Dynamic Host Configuration Protocol](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol) (DHCP) |
|    80    | [Hypertext Transfer Protocol](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) (HTTP) used in the [World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web) |
|   110    | [Post Office Protocol](https://en.wikipedia.org/wiki/Post_Office_Protocol) (POP3) |
|   119    | [Network News Transfer Protocol](https://en.wikipedia.org/wiki/Network_News_Transfer_Protocol) (NNTP) |
|   123    | [Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol) (NTP) |
|   143    | [Internet Message Access Protocol](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) (IMAP) Management of digital mail |
|   161    | [Simple Network Management Protocol](https://en.wikipedia.org/wiki/Simple_Network_Management_Protocol) (SNMP) |
|   194    | [Internet Relay Chat](https://en.wikipedia.org/wiki/Internet_Relay_Chat) (IRC) |
|   443    | [HTTP Secure](https://en.wikipedia.org/wiki/HTTP_Secure) (HTTPS) HTTP over TLS/SSL |
| 546, 547 | [DHCPv6](https://en.wikipedia.org/wiki/DHCPv6) IPv6 version of DHCP |