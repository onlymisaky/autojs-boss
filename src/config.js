import configJson from '@/config.json';

let config = configJson;

try {
  const path = files.join(files.cwd(), 'boss-auto-config.json')
  const configStr = files.read(path, 'utf-8');
  config = JSON.parse(configStr);
}
catch (error){
  config = configJson;
}

export default config;
