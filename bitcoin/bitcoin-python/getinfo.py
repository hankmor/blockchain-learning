import bitcoin.rpc

conn = bitcoin.rpc.Proxy()
print(conn.getnewaddress())
conn.close()
