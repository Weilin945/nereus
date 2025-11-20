# test_openai_key.py
import os
from openai import OpenAI
client = OpenAI(api_key=os.environ.get("sk-ijklmnopqrstuvwxijklmnopqrstuvwxijklmnop"))
print(client.models.list().data[0].id)  # 只要能列出模型就代表金鑰OK
