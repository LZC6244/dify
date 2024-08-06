

QUESTION_CLASSIFIER_SYSTEM_PROMPT = """
作为一个向量检索助手，你的任务是结合历史记录，将“原问题”生成“检索词”，从而提高向量检索的精度。生成的问题要求指向对象清晰明确，并与“原问题语言相同”。例如：
历史记录: 
---
---
原问题: 介绍下剧情。
检索词: 介绍下剧情。
----------------
历史记录: 
---
Q: 对话背景。
A: 当前对话是关于 Nginx 的介绍和使用等。
---
原问题: 怎么下载
检索词: Nginx怎么下载？
----------------
历史记录: 
---
Q: 对话背景。
A: 当前对话是关于 Nginx 的介绍和使用等。
Q: 报错 "no connection"
A: 报错"no connection"可能是因为……
---
原问题: 怎么解决
检索词: Nginx报错"no connection"如何解决？
----------------
历史记录: 
---
Q: 护产假多少天?
A: 护产假的天数根据员工所在的城市而定。请提供您所在的城市，以便我回答您的问题。
---
原问题: 沈阳
检索词: 沈阳的护产假多少天？
----------------
历史记录:
---
Q: 对话背景。
A: 关于 卓世Agent 的介绍和使用等问题。
---
原问题: 你好。
检索词: 你好
----------------
历史记录:
---
Q: 卓世Agent 如何收费？
A: 卓世Agent 收费可以参考……
---
原问题: 你知道 laf 么？
检索词: 你知道 laf 么？
----------------
历史记录:
---
Q: 卓世Agent 的优势
A: 1. 开源
   2. 简便
   3. 扩展性强
---
原问题: 介绍下第2点。
检索词: 介绍下 卓世Agent 简便的优势
----------------
历史记录:
---
Q: 什么是 卓世Agent？
A: 卓世Agent 是一个 RAG 平台。
Q: 什么是 Laf？
A: Laf 是一个云函数开发平台。
---
原问题: 它们有什么关系？
检索词: 卓世Agent和Laf有什么关系？
----------------
历史记录:
---
{histories}
---
"""

QUESTION_CLASSIFIER_USER_PROMPT = """
原问题: {input_text}
检索词: 
"""

FASTGPT_PROMPT = """
作为一个向量检索助手，你的任务是结合历史记录，从不同角度，为“原问题”生成个不同版本的“检索词”，从而提高向量检索的语义丰富度，提高向量检索的精度。生成的问题要求指向对象清晰明确，并与“原问题语言相同”。例如：
历史记录: 
---
---
原问题: 介绍下剧情。
检索词: ["介绍下故事的背景。","故事的主题是什么？","介绍下故事的主要人物。"]
----------------
历史记录: 
---
Q: 对话背景。
A: 当前对话是关于 Nginx 的介绍和使用等。
---
原问题: 怎么下载
检索词: ["Nginx 如何下载？","下载 Nginx 需要什么条件？","有哪些渠道可以下载 Nginx？"]
----------------
历史记录: 
---
Q: 对话背景。
A: 当前对话是关于 Nginx 的介绍和使用等。
Q: 报错 "no connection"
A: 报错"no connection"可能是因为……
---
原问题: 怎么解决
检索词: ["Nginx报错"no connection"如何解决？","造成'no connection'报错的原因。","Nginx提示'no connection'，要怎么办？"]
----------------
历史记录: 
---
Q: 护产假多少天?
A: 护产假的天数根据员工所在的城市而定。请提供您所在的城市，以便我回答您的问题。
---
原问题: 沈阳
检索词: ["沈阳的护产假多少天？","沈阳的护产假政策。","沈阳的护产假标准。"]
----------------
历史记录: 
---
Q: 作者是谁？
A: FastGPT 的作者是 labring。
---
原问题: Tell me about him
检索词: ["Introduce labring, the author of FastGPT." ," Background information on author labring." "," Why does labring do FastGPT?"]
----------------
历史记录:
---
Q: 对话背景。
A: 关于 FatGPT 的介绍和使用等问题。
---
原问题: 你好。
检索词: ["你好"]
----------------
历史记录:
---
Q: FastGPT 如何收费？
A: FastGPT 收费可以参考……
---
原问题: 你知道 laf 么？
检索词: ["laf 的官网地址是多少？","laf 的使用教程。","laf 有什么特点和优势。"]
----------------
历史记录:
---
Q: FastGPT 的优势
A: 1. 开源
   2. 简便
   3. 扩展性强
---
原问题: 介绍下第2点。
检索词: ["介绍下 FastGPT 简便的优势", "从哪些方面，可以体现出 FastGPT 的简便"]。
----------------
历史记录:
---
Q: 什么是 FastGPT？
A: FastGPT 是一个 RAG 平台。
Q: 什么是 Laf？
A: Laf 是一个云函数开发平台。
---
原问题: 它们有什么关系？
检索词: ["FastGPT和Laf有什么关系？","介绍下FastGPT","介绍下Laf"]
----------------
历史记录:
---
{histories}
---
"""



QUESTION_CLASSIFIER_COMPLETION_PROMPT = """
### Job Description
You are a text classification engine that analyzes text data and assigns categories based on user input or automatically determined categories.
### Task
Your task is to assign one categories ONLY to the input text and only one category may be assigned returned in the output.  Additionally, you need to extract the key words from the text that are related to the classification.
### Format
The input text is in the variable input_text. Categories are specified as a category list  with two filed category_id and category_name in the variable categories. Classification instructions may be included to improve the classification accuracy.
### Constraint 
DO NOT include anything other than the JSON array in your response.
### Example
Here is the chat example between human and assistant, inside <example></example> XML tags.
<example>
User:{{"input_text": ["I recently had a great experience with your company. The service was prompt and the staff was very friendly."], "categories": [{{"category_id":"f5660049-284f-41a7-b301-fd24176a711c","category_name":"Customer Service"}},{{"category_id":"8d007d06-f2c9-4be5-8ff6-cd4381c13c60","category_name":"Satisfaction"}},{{"category_id":"5fbbbb18-9843-466d-9b8e-b9bfbb9482c8","category_name":"Sales"}},{{"category_id":"23623c75-7184-4a2e-8226-466c2e4631e4","category_name":"Product"}}], "classification_instructions": ["classify the text based on the feedback provided by customer"]}}
Assistant:{{"keywords": ["recently", "great experience", "company", "service", "prompt", "staff", "friendly"],"category_id": "f5660049-284f-41a7-b301-fd24176a711c","category_name": "Customer Service"}}
User:{{"input_text": ["bad service, slow to bring the food"], "categories": [{{"category_id":"80fb86a0-4454-4bf5-924c-f253fdd83c02","category_name":"Food Quality"}},{{"category_id":"f6ff5bc3-aca0-4e4a-8627-e760d0aca78f","category_name":"Experience"}},{{"category_id":"cc771f63-74e7-4c61-882e-3eda9d8ba5d7","category_name":"Price"}}], "classification_instructions": []}}
Assistant:{{"keywords": ["bad service", "slow", "food", "tip", "terrible", "waitresses"],"category_id": "f6ff5bc3-aca0-4e4a-8627-e760d0aca78f","category_name": "Experience"}}
</example> 
### Memory
Here is the chat histories between human and assistant, inside <histories></histories> XML tags.
<histories>
{histories}
</histories>
### User Input
{{"input_text" : ["{input_text}"], "categories" : {categories},"classification_instruction" : ["{classification_instructions}"]}}
### Assistant Output
"""
