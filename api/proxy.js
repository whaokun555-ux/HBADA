// Vercel Serverless Function - 飞书 Webhook 代理
// webhook 地址仅存于服务端，前端完全不可见

const HR_HOOKS = {
  '白听白':   'dd9bbfef-ae01-42c3-a2a8-3a6b2337a505',
  '黑墨沉香': '0ea0de55-c726-4cf0-9be6-c3bcd7a8cde5',
  '白桃乌龙': 'e11e588a-4ffb-4ba3-aef6-d1c9ea4ad983',
  '黑葫乐':   'd563b804-2372-4072-8bdb-ccd479ff0157',
  '白望舟':   '7b3e5c87-16f3-49da-9d78-92de88399d65',
  '白诗文':   'df46118d-ba88-4810-9489-a1c476165df9',
  '白一千':   'f39ce2cd-5cff-4d89-814f-f56e5c638553',
  '白筱俪':   '24722336-f914-4664-b92b-70ca913ea283',
  '黑白明辉': 'cf1de39c-0730-4c33-a020-c4a2644672e7',
  '黑轮':     '2d51860c-9f71-40bd-85cf-19fc1e141d26',
  '白艾米':   'e726ef1d-33bd-4f9c-b377-65649ef1eae5'
};

const HOOK_BASE = 'https://open.feishu.cn/open-apis/bot/v2/hook/';

export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 只允许来自测评页面的请求
  const origin = req.headers.origin || '';
  if (!origin.includes('whaokun555-ux.github.io') && !origin.includes('localhost')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const { hrName, text } = req.body;

    if (!hrName || !text) {
      return res.status(400).json({ error: 'Missing hrName or text' });
    }

    const hookId = HR_HOOKS[hrName];
    if (!hookId) {
      return res.status(400).json({ error: 'Unknown HR: ' + hrName });
    }

    // 转发到飞书
    const feishuUrl = HOOK_BASE + hookId;
    const feishuResp = await fetch(feishuUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msg_type: 'text',
        content: { text: text }
      })
    });

    const result = await feishuResp.json();
    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
