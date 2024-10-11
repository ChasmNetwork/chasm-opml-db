# Chasm opML Database
Chasm Database is powered by Chromia for data transparency layer.

## Production Details
Cluster: [Pink](https://explorer.chromia.com/mainnet/cluster/pink)
Dapp: [chasm_opml](https://explorer.chromia.com/mainnet/blockchain/A870F5744F8C4EDFE5AAD5556B1B4DA1DCC6FB53B0E8CFAB84F9155A51D1042C)
BRID: `A870F5744F8C4EDFE5AAD5556B1B4DA1DCC6FB53B0E8CFAB84F9155A51D1042C`

## Prerequisite
- [Installation Guide](https://docs.chromia.com/getting-started/dev-setup/cli-installation)
- [IDE Setup](https://docs.chromia.com/getting-started/plugin/vscode-installation)

## How to setup development

### Run Rell code
1. `chr install` should installed FT4 into `src/lib/ft4`
2. create a file `.chroma/chasm-test` with this test key

```
privkey=0101010101010101010101010101010101010101010101010101010101010101
pubkey=031b84c5567b126440995d3ed5aaba0565d71e1834604819ff9c17f5e9d5dd078f
```

3. Update variables

Update pubkey in `development.rell`
```rell
object owner {
    mutable address: pubkey = x"031b84c5567b126440995d3ed5aaba0565d71e1834604819ff9c17f5e9d5dd078f";
}
```

In [main.rell](./src/main.rell) Update the line 
```rell
// FROM
import production.{owner};
// TO
import development.{owner};
```

Update [chromia.yml](./chromia.yml)
```yml
blockchains:
  prompt:
    module: development
```

4. `chr build` to ensure build has no issue
5. `chr test`

### Test out client

Before running the script, make sure the local client is up. 

```sh
chr node start
# if needed to wipe db
chr node start --wipe
# Can update code via update command
chr node update
```
#### Nodejs

```sh
bun i
bun run nodejs
```

#### Python
Chromia does not have official python client, so we are using the Postchain API.

```sh
python script/query_data.py # bun run python
```

### Production

Make sure setup `~/.chroma/config` with private key at `~/.chroma/chasm-production`

```
key.id = chasm-production
```



```sh
# Deployment
chr deployment create --settings chromia.yml --network mainnet --blockchain prompt                                                                                       
# Update
chr deployment update --network mainnet
```
