import time
import requests
from requests.models import PreparedRequest

class ChromiaDatabase:
    def __init__(self, base_url: str, brid = None):
        self.base_url = base_url
        self.brid = brid
    
    def set_brid(self, brid):
        self.brid = brid

    def get_blockchain_brid(self, iid):
        api_url = f"{self.base_url}/brid/iid_{iid}"
        response = requests.get(api_url, headers={"Content-Type": "text/plain"})
        return response.text
    
    def get_prompt_histories(self, start_time, end_time, n_prompts):
        url = f"{self.base_url}/query/{self.brid}"
        req = PreparedRequest()
        req.prepare_url(url, {
            "type": "get_prompt_histories",
            "start_time": start_time,
            "end_time": end_time,
            "n_prompts": n_prompts,
        })
        response = requests.get(req.url, headers={"Content-Type": "application/json"})
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to retrieve data. Status code: {response.status_code}")
            print(response.text)

if __name__ == "__main__":
    base_url: str = "http://localhost:7740"
    chromia = ChromiaDatabase(base_url)
    brid = chromia.get_blockchain_brid(0)
    print(brid)
    chromia.set_brid(brid)

    # Get blockchain brid
    brid = chromia.get_blockchain_brid(0)
    print(brid)

    # Get prompt history
    current_time = round(time.time() * 1000)
    data = chromia.get_prompt_histories(
        start_time=-1,
        end_time=current_time,
        n_prompts=20
    )
    print("--------")
    if data is None or len(data) == 0:
        print("No data")
        exit()
    print(data)
    print(len(data))