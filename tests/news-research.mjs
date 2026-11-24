import {execFileSync} from 'node:child_process';
execFileSync(process.env.PYTHON||(process.platform==='win32'?'python':'python3'),['-B','tests/news_research.py'],{stdio:'inherit'});
