import {
	showImgListPreview, formatSize, loadCss, createDomByHtml, resolveFileExtension, trim,
	keepRectInContainer,
	domContained,
	Dialog,
	TRIM_RIGHT,
	KEYS,
	copy,
	Toast
} from "//localhost/webcom/dist/webcom.es.js"

//https://cdn.jsdelivr.net/gh/sasumi/webcom@master/dist/webcom.es.js

const BASE_PATH = (() => {
	let ss = document.querySelectorAll('script');
	let basePath = '/';
	ss.forEach(script => {
		let idx = script.src.indexOf('index20220610');
		if(idx >= 0){
			basePath = script.src.substring(0, idx);
			return false;
		}
	});
	return basePath;
})();

const TYPE_DIR = 'dir';
const TYPE_FILE = 'file';
const MODE_LIST = 'list';
const MODE_THUMB = 'thumb';

const CMD_COPY_LOCAL_PATH = 'copy_local_path';
const CMD_OPEN_NEW_WINDOW = 'open_new_window';
const CMD_COPY_PATH = 'copy_path';
const CMD_INFO = 'info';
const CMD_SET_LOCAL_ROOT = 'set_local_root';

const SORT_DIR_ASC = 'asc';
const SORT_DIR_DESC = 'desc';
const CMD_SORT_BY_NAME = 'name';
const CMD_SORT_BY_LAST_MODIFIED = 'last_modified';
const CMD_SORT_BY_SIZE = 'size';
const CMD_SORT_BY_TYPE = 'type';

const saveConfig = (key, value)=>{
	window.localStorage.setItem(key, JSON.stringify(value));
}

const readConfig = (key, defaultValue) => {
	let v = window.localStorage.getItem(key);
	if(v !== null){
		return JSON.parse(v);
	}
	return defaultValue;
}

const dateConv = (dateStr)=>{
	let d = new Date(dateStr);
	return d.getFullYear()+'-'+(d.getMonth()+1).toString().padStart(2, '0')+'-'+d.getDate().toString().padStart(2, '0')+' '+d.getHours().toString().padStart(2, '0')+':'+d.getMinutes().toString().padStart(2, '0');
}

const EXT_IS_IMG = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'tiff'];

const EXT_ICO_MAP = {
	'folder': 'folder',
	'file': 'file',
	'access': 'access',
	'actionscript': 'actionscript',
	'vbs': 'actionscript',
	'ada': 'ada',
	'adonisjs': 'adonisjs',
	'ae': 'ae',
	'ai': 'ai',
	'angular': 'angular',
	'apache': 'apache',
	'applescript': 'applescript',
	'archive': 'archive',
	'jar': 'archive',
	'zip': 'archive',
	'7z': 'archive',
	'rar': 'archive',
	'arduino': 'arduino',
	'astro': 'astro',
	'audio': 'audio',
	'babel': 'babel',
	'bazel': 'bazel',
	'binary': 'binary',
	'blade': 'blade',
	'blender': 'blender',
	'bower': 'bower',
	'c': 'c',
	'cpp': 'cpp',
	'c++': 'c',
	'cabal': 'cabal',
	'cad': 'cad',
	'caddy': 'caddy',
	'cf': 'cf',
	'circleci': 'circleci',
	'clojure': 'clojure',
	'cmake': 'cmake',
	'cobol': 'cobol',
	'coffeescript': 'coffeescript',
	'composer': 'composer',
	'coreboot': 'coreboot',
	'cottle': 'cottle',
	'crystal': 'crystal',
	'csharp': 'csharp',
	'css': 'css',
	'csv': 'csv',
	'cython': 'cython',
	'dart': 'dart',
	'default': 'default',
	'delphi': 'delphi',
	'diff': 'diff',
	'dlang': 'dlang',
	'docker': 'docker',
	'dotnet': 'dotnet',
	'ini': 'editorconfig',
	'editorconfig': 'editorconfig',
	'ejs': 'ejs',
	'elm': 'elm',
	'ember': 'ember',
	'erlang': 'erlang',
	'eslint': 'eslint',
	'ex': 'ex',
	'xls': 'excel',
	'xlsx': 'excel',
	'fastq': 'fastq',
	'font': 'font',
	'fortran': 'fortran',
	'fsharp': 'fsharp',
	'git': 'git',
	'go': 'go',
	'gradle': 'gradle',
	'graphql': 'graphql',
	'graphviz': 'graphviz',
	'groovy': 'groovy',
	'gruntfile': 'gruntfile',
	'gulpfile': 'gulpfile',
	'hack': 'hack',
	'haml': 'haml',
	'harbour': 'harbour',
	'haskell': 'haskell',
	'haxe': 'haxe',
	'html': 'html',
	'htm': 'html',
	'http': 'http',
	'image': 'image',
	'indesign': 'indesign',
	'java': 'java',
	'jenkins': 'jenkins',
	'js': 'js',
	'json': 'json',
	'jsp': 'jsp',
	'jsx': 'jsx',
	'julia': 'julia',
	'kotlin': 'kotlin',
	'less': 'less',
	'license': 'license',
	'liquid': 'liquid',
	'lisp': 'lisp',
	'lock': 'lock',
	'log': 'log',
	'lsl': 'lsl',
	'lua': 'lua',
	'md': 'markdown',
	'markdownx': 'markdownx',
	'markup': 'markup',
	'matlab': 'matlab',
	'maya': 'maya',
	'mint': 'mint',
	'mp3tag': 'mp3tag',
	'mustache': 'mustache',
	'nginx': 'nginx',
	'nim': 'nim',
	'nodejs': 'nodejs',
	'note': 'note',
	'npm': 'npm',
	'nsis': 'nsis',
	'ocaml': 'ocaml',
	'onenote': 'onenote',
	'pawn': 'pawn',
	'pcb': 'pcb',
	'pdf': 'pdf',
	'perl': 'perl',
	'php': 'php',
	'parent': 'parent',
	'png': 'image',
	'jpg': 'image',
	'gif': 'image',
	'jpeg': 'image',
	'plist': 'plist',
	'postcss': 'postcss',
	'powerpoint': 'powerpoint',
	'ppt': 'powerpoint',
	'pptx': 'powerpoint',
	'powershell': 'powershell',
	'preferences': 'preferences',
	'premiere': 'premiere',
	'prisma': 'prisma',
	'procfile': 'procfile',
	'protobuf': 'protobuf',
	'psd': 'psd',
	'pug': 'pug',
	'puppet': 'puppet',
	'purebasic': 'purebasic',
	'python': 'python',
	'qt': 'qt',
	'r': 'r',
	'rails': 'rails',
	'reach': 'reach',
	'react': 'react',
	'registry': 'registry',
	'restructuredtext': 'restructuredtext',
	'riot': 'riot',
	'ruby': 'ruby',
	'rust': 'rust',
	'sass': 'sass',
	'scala': 'scala',
	'scss': 'scss',
	'settings': 'settings',
	'shell': 'shell',
	'bat': 'shell',
	'sketch': 'sketch',
	'slim': 'slim',
	'source': 'source',
	'sql': 'sql',
	'stata': 'stata',
	'stylelint': 'stylelint',
	'stylus': 'stylus',
	'sublime': 'sublime',
	'svelte': 'svelte',
	'svg': 'svg',
	'swift': 'swift',
	'tailwind': 'tailwind',
	'taskfile': 'taskfile',
	'tcl': 'tcl',
	'tern': 'tern',
	'terraform': 'terraform',
	'test_js': 'test_js',
	'test_jsx': 'test_jsx',
	'test_tsx': 'test_tsx',
	'test_typescript': 'test_typescript',
	'tex': 'tex',
	'text': 'text',
	'txt': 'text',
	'textile': 'textile',
	'todo': 'todo',
	'toml': 'toml',
	'tsx': 'tsx',
	'twig': 'twig',
	'typescript': 'typescript',
	'ts': 'typescript',
	'unity3d': 'unity3d',
	'v': 'v',
	'vala': 'vala',
	'vhdl': 'vhdl',
	'video': 'video',
	'mp4': 'video',
	'avi': 'video',
	'mkv': 'video',
	'vim': 'vim',
	'visualstudio': 'visualstudio',
	'vue': 'vue',
	'webpack': 'webpack',
	'windows': 'windows',
	'word': 'word',
	'doc': 'word',
	'docx': 'word',
	'rtf': 'word',
	'xsl': 'xsl',
	'yaml': 'yaml',
	'yarn': 'yarn',
	'zig': 'zig',
};
if(document.querySelector('body>h1') && document.querySelector('body>pre')){

let tmp = readConfig('SORT', {sortBy: CMD_SORT_BY_NAME, sortDir: SORT_DIR_ASC}) ;
let {sortBy, sortDir} = tmp;


console.log('tmp', tmp);
//////////////////////////
// 	loadCss(BASE_PATH+'style.css');
	const IS_ROOT = /:\/\/[^\/]+\/?$/.test(location.href);
	const LOCAL_PATH_STORE_KEY = 'local_root';
	const PATH_DOM = createDomByHtml(`<div class="path-list"></div>`, document.body);
	console.log(sortBy, sortDir);

	const OPTION_DOM = createDomByHtml(`
			<div class="options">
				<label>View As:</label>
				<span class="toggle-switcher">
					<span data-mode="list"></span>
					<span data-mode="thumb"></span>
				</span>
				<label>Sort By:</label>
				<dl class="dropdown" id="sort-menu">
					<dt>Name Asc</dt>
					<dd class="menu">
						<span class="menu-item ${sortBy === CMD_SORT_BY_NAME && sortDir === SORT_DIR_ASC ? "menu-item-checked" :""}" data-cmd="${CMD_SORT_BY_NAME}" data-sort-dir="${SORT_DIR_ASC}">Name Asc</span>
						<span class="menu-item ${sortBy === CMD_SORT_BY_NAME && sortDir === SORT_DIR_DESC ? "menu-item-checked" :""}" data-cmd="${CMD_SORT_BY_NAME}" data-sort-dir="${SORT_DIR_DESC}">Name Desc</span>
						<span class="menu-sep"></span>
						<span class="menu-item" data-cmd="${CMD_SORT_BY_LAST_MODIFIED}" data-sort-dir="${SORT_DIR_ASC}">Last Modified Asc</span>
						<span class="menu-item" data-cmd="${CMD_SORT_BY_LAST_MODIFIED}" data-sort-dir="${SORT_DIR_DESC}">Last Modified Desc</span>
						<span class="menu-sep"></span>
						<span class="menu-item" data-cmd="${CMD_SORT_BY_SIZE}" data-sort-dir="${SORT_DIR_ASC}">Small Size First</span>
						<span class="menu-item" data-cmd="${CMD_SORT_BY_SIZE}" data-sort-dir="${SORT_DIR_DESC}">Bigger Size First</span>
						<span class="menu-sep"></span>
						<span class="menu-item" data-cmd="${CMD_SORT_BY_TYPE}" data-sort-dir="${SORT_DIR_ASC}">File Types</span>
					</dd>
				</dl>
				<dl class="dropdown dropdown-left" id="setting-menu">
					<dt><span class="setting-entry"></span></dt>
					<dd class="menu">
						<span class="menu-item" data-cmd="${CMD_SET_LOCAL_ROOT}">设置本地ROOT路径</span>
					</dd>	
				</dl>
			</div>`, document.body);

	let selOpt = OPTION_DOM.querySelector(`span[data-cmd="${sortBy}"][data-sort-dir="${sortDir}"]`);
	selOpt.classList.add('menu-item-checked');
	OPTION_DOM.querySelector('#sort-menu dt').innerText = selOpt.innerText;

	const LIST_DOM = createDomByHtml(`<ul id="file-list" class="mode-list"></ul>`, document.body);
	LIST_DOM.addEventListener('contextmenu', e=>{
		showContext(location.href, {x:e.clientX, y:e.clientY});
		e.preventDefault();
		return false;
	})

	const FILE_CONTEXT = createDomByHtml(
		`<ul class="context menu" style="display:none; left:300px; top:300px;">
			<span class="menu-item" data-cmd="${CMD_COPY_PATH}">Copy path</span>
			<span class="menu-item" data-cmd="${CMD_COPY_LOCAL_PATH}">Copy local path</span>
			<span class="menu-item" data-cmd="${CMD_OPEN_NEW_WINDOW}">Open in new window</span>
			<span class="menu-sep"></span>
			<span class="menu-item" data-cmd="${CMD_INFO}">Info</span>
		</ul>`, document.body);

	document.body.addEventListener('click', e=>{
		if(e.target && e.target.getAttribute('data-cmd')){
			let cmd = e.target.getAttribute('data-cmd');
			let path = e.target.getAttribute('data-path');
			let sort_dir = e.target.getAttribute('data-sort-dir');
			switch(cmd){
				case CMD_OPEN_NEW_WINDOW:
					window.open(path);
					break;
				case CMD_COPY_PATH:
					copy(path, true);
					Toast.showSuccess('已复制到剪贴板');
					break;
				case CMD_COPY_LOCAL_PATH:
					getLocalRootPathAsync().then(val => {
						copy(val + path, true);
						Toast.showSuccess('已复制到剪贴板');
					})
					break;
				case CMD_SET_LOCAL_ROOT:
					setLocalRootPath();
					break;
				case CMD_INFO:
					break;
				case 'preview':
					break;

				case CMD_SORT_BY_NAME:
				case CMD_SORT_BY_LAST_MODIFIED:
				case CMD_SORT_BY_SIZE:
				case CMD_SORT_BY_TYPE:
					e.target.parentNode.childNodes.forEach(child => {
						child.nodeType !== 3 && child.classList.remove('menu-item-checked');
					});
					e.target.classList.add('menu-item-checked');
					saveConfig('SORT', {sortBy:cmd, sortDir:sort_dir});
					OPTION_DOM.querySelector('#sort-menu dt').innerText = e.target.innerText;
					sortList(cmd, sort_dir);
					break;

				default:
					throw "No command found";
			}
		}
	})

//HIDE context
	FILE_CONTEXT.addEventListener('click',()=>{hideContext()});
	document.body.addEventListener('click', e=>{
		if(!domContained([FILE_CONTEXT], e.target, true)){
			hideContext();
		}
	});
	document.body.addEventListener('keydown', e=>{
		if(e.keyCode === KEYS.Esc){
			hideContext();
		}
	});

	const getLocalRootPathAsync = (with_setting = false)=>{
		return new Promise(resolve => {
			let v = readConfig(LOCAL_PATH_STORE_KEY);
			if(v){
				resolve(v);
			} else if(with_setting) {
				setLocalRootPath().then(v=>{
					resolve(v);
				}, err=>{
					console.log(err);
					debugger;
				});
			} else {
				//ignore
			}
		});
	};

	const setLocalRootPath = ()=>{
		return new Promise((resolve, reject)=>{
			Dialog.prompt('请输入本地ROOT路径：', {initValue:readConfig(LOCAL_PATH_STORE_KEY)}).then(val => {
				let v = val.trim();
				if(!v.length){
					Toast.showInfo('请输入内容');
					return false;
				}
				saveConfig(LOCAL_PATH_STORE_KEY, v);
				Toast.showSuccess('配置保存成功');
				resolve(v);
			}, err=>{});
		});
	};

	let _LIST = [];
	const resolveFileList = () => {
		if(_LIST.length){
			return _LIST;
		}
		let listCon = document.querySelector('pre').innerHTML.split("\n");
		let list = [];
		let root = location.href;
		listCon.forEach(line => {
			if(/>\s*\.\.\/\s*</.test(line)){
				//ignore parent;
			}else{
				let matches = /<a\s*href="([^"]+)">(.*?)<\/a>\s+(.*?)\s{5,}(.*)\s*/i.exec(line);
				if(matches){
					let type = matches[1].substring(matches[1].length - 1) === '/' ? TYPE_DIR : TYPE_FILE;
					if(type === TYPE_DIR){
						// debugger;
					}
					list.push({
						type: type,
						path: root+matches[1],
						title: type === TYPE_DIR ? trim(matches[2], '/', TRIM_RIGHT) : matches[2],
						extension: type === TYPE_FILE ? resolveFileExtension(matches[1]).toLowerCase() : null,
						createdAt: dateConv(matches[3].trim()),
						size: matches[4].trim()
					})
				}
			}
		});
		_LIST = list;
		return list;
	}

	const resolvePathList = () => {
		let str = document.querySelector('h1').innerText.trim();
		str = str.replace(/^index\s*of\s*/i, '');
		str = trim(str, '/');
		let path_list = [{path: '/', title: ''}];
		let last_path = '/';
		if(str.length){
			str.split('/').forEach(seg => {
				path_list.push({
					path: last_path + seg + '/',
					title: seg
				});
				last_path += seg + '/';
			});
		}
		return path_list;
	}

	const renderPathList = (paths)=>{
		let html = '';
		paths.forEach(path => {
			html += `<a href="${path.path}">${path.title}</a>`;
		});
		PATH_DOM.innerHTML = html;
	}

	const renderStatusBar = ()=>{
		let list = resolveFileList();
		let file_count = 0;
		let dir_count = 0;
		let size_sum = 0;
		list.forEach(item=>{
			file_count += item.type === TYPE_DIR ? 0 : 1;
			dir_count += item.type === TYPE_DIR ? 1 : 0;
			size_sum += parseInt(item.size, 10) || 0;
		});

		let sum_text = [];
		if(file_count){
			sum_text.push(`文件：${file_count}个`);
		}
		if(dir_count){
			sum_text.push(`文件夹：${dir_count}个`);
		}
		if(size_sum){
			sum_text.push(`文件大小总计：${formatSize(size_sum)}`);
		}
		createDomByHtml(`<div class="status-bar"><span class="file-sum">${sum_text.join("，")}</span></div>`, document.body);
	}

	const hideContext = () => {
		FILE_CONTEXT.style.display = 'none';
	}

	const showContext = ((path, {x, y}) => {
		FILE_CONTEXT.style.display = '';
		let {left, top} = keepRectInContainer({
			left: x,
			top: y,
			width: FILE_CONTEXT.offsetWidth,
			height: FILE_CONTEXT.offsetHeight
		});

		FILE_CONTEXT.style.top = top + 'px';
		FILE_CONTEXT.style.left = left + 'px';
		FILE_CONTEXT.querySelectorAll('li').forEach(li=>li.setAttribute('data-path', path));
	})

	const sortList = (sortBy, sortDir)=>{
		sortDir = sortDir || SORT_DIR_ASC;
		let list = resolveFileList();
		list = list.sort((item1, item2)=>{
			let n1, n2;
			switch(sortBy){
				case CMD_SORT_BY_LAST_MODIFIED:
					n1 = item1.createdAt;
					n2 = item2.createdAt;
					break;
				case CMD_SORT_BY_SIZE:
					n1 = item1.size;
					n2 = item2.size;
					break;
				case CMD_SORT_BY_TYPE:
					n1 = item1.extension;
					n2 = item2.extension;
					break;

				case CMD_SORT_BY_NAME:
				default:
					n1 = item1.title.toUpperCase();
					n2 = item2.title.toUpperCase();
					break;
			}
			return sortDir === SORT_DIR_ASC ?
				(n1 < n2 ? -1 : (n1>n2 ? 1 : 0)) :
				(n1 < n2 ? 1 : (n1>n2 ? -1 : 0));
		});
		renderList(list);
		return list;
	}

	const renderList = (List) => {
		let html = '',
			list = Object.assign([], List);
		!IS_ROOT && list.unshift({type: TYPE_DIR, path: '../', title: 'Parent', size: '-', extension: 'parent', createdAt: ''});
		list.forEach(item => {
			let n = EXT_ICO_MAP[item.extension] ? EXT_ICO_MAP[item.extension] : (item.type === TYPE_DIR ? EXT_ICO_MAP.folder : EXT_ICO_MAP.file);
			let isImg = EXT_IS_IMG.includes(item.extension);
			let ico_src = isImg ? item.path : BASE_PATH+'icon/'+n+'.png';
			html += `<li data-type="${item.type}" data-path="${item.path}" data-extension="${item.extension}" data-is-image="${isImg ? '1':'0'}">
					<a href="${item.path}">
						<i><img src="${ico_src}" alt=""></i>
						<span class="name">${item.title}</span>
						<span class="created-at">${item.createdAt}</span>
						<span class="size">${formatSize(item.size)}</span>
					</a>
				</li>`;
		});
		LIST_DOM.innerHTML = html;

		//bind node context
		LIST_DOM.querySelectorAll('li').forEach(li=>{
			li.addEventListener('contextmenu', e=>{
				showContext(li.getAttribute('data-path'), {x:e.clientX, y:e.clientY});
				e.stopPropagation();
				e.preventDefault();
			});
		})
	}

	sortList(sortBy, sortDir);

	let imgNodes = LIST_DOM.querySelectorAll('li[data-is-image="1"] a');
	let imgSrcList = [];
	imgNodes.forEach((linkNode ,idx)=>{
		imgSrcList.push(linkNode.href);
		linkNode.addEventListener('click', e=>{
			showImgListPreview(imgSrcList,idx);
			e.preventDefault();
		});
	});

	let mode = readConfig('view-style', MODE_THUMB);
	LIST_DOM.className = mode === MODE_THUMB ? 'mode-thumb' : 'mode-list';
	document.querySelector(`.toggle-switcher>span[data-mode="${mode}"]`).classList.add('active');

	document.querySelectorAll('.toggle-switcher>span').forEach(item=>{
		item.addEventListener('click', e=>{
			item.parentNode.childNodes.forEach(n => {
				n.nodeType !== 3 && n.classList.remove('active')
			});
			item.classList.add('active');
			switch(item.getAttribute('data-mode')){
				case MODE_LIST:
					LIST_DOM.className = 'mode-list';
					saveConfig('view-style', MODE_LIST);
					break;

				case MODE_THUMB:
					LIST_DOM.className = 'mode-thumb';
					saveConfig('view-style', MODE_THUMB);
					break;
				default:
					throw "No data-value found";
			}
		})
	})

	let paths = resolvePathList();
	renderPathList(paths);

	renderStatusBar();
} else {
	console.warn('no support for no-html page');
}
