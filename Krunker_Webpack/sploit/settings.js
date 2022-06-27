'use strict';

var { api, meta, loader, frame } = require('../libs/consts.js'),
	UI = require('../libs/FloatUI'),
	File = require('../libs/File'),
	Keybind = require('../libs/Keybind'),
	Request = require('../libs/Request'),
	utils = require('../libs/Utils'),
	menu = new UI.Config(frame, 'CHEESE 2.0.1', 'config'),
	binds = {
		toggle: new Keybind().callback(() => {
			if(menu.visible)menu.hide();
			else document.exitPointerLock(), menu.show();
		}),
		reset: new Keybind().callback(() => menu.load_preset('Default', {
			binds: menu.menu.binds,
		})),
	};

var Render = menu.tab('VISUALS');

Render.control('ESP', {
	name: 'ESP Mode',
	type: 'dropdown',
	walk: 'esp.status',
	value: {
		'Disabled': 'off',
		'Player Box': 'box',
		'Player Chams': 'chams',
		'Box and Chams': 'box_chams',
		'Enable All': 'full',
	},
});

Render.control('Constant Nametags', {
	type: 'boolean',
	walk: 'esp.nametags',
});

Render.control('Healthbar', {
	type: 'boolean',
});

Render.control('Tracerlines', {
	type: 'boolean',
	walk: 'esp.tracers',
});

Render.control('Enemy Color', {
	type: 'color',
	walk: 'colors.hostile',
});

Render.control('Enemy Visible Color', {
	type: 'color',
	walk: 'colors.risk',
});

Render.control('Friendly Color', {
	type: 'color',
	walk: 'colors.friendly',
});

Render.control('Rainbow Color', {
	type: 'boolean',
	walk: 'colors.rainbow',
});

/*
Game.control('Custom Loading Screen', {
	type: 'boolean',
	walk: 'game.custom_loading',
});
*/






var Weapon = menu.tab('AIMBOT');

Weapon.control('Auto Aim Mode', {
	type: 'dropdown',
	walk: 'aim.status',
	value: {
		'Disabled': 'off',
		'Triggerbot': 'trigger',
		'Unsilent Aim': 'assist',
		'Silent Aim': 'correction',
		'Auto Silent': 'auto',
	},
});

Weapon.control('Hit Area', {
	type: 'dropdown',
	walk: 'aim.offset',
	value: {
		// Head: 'head',
		'Hit Head': 'multi',
		'Hit Chest': 'chest',
		'Hit Legs': 'legs',
		'Random Hit Area': 'random',
		//'Multi': 'multi',
	},
});

Weapon.control('Aim Smoothing', {
	type: 'slider',
	walk: 'aim.smooth',
	min: 0,
	max: 2,
	step: 0.01,
	labels: { 0: 'No Smoothing' },
});

Weapon.control('Target Priority', {
	type: 'dropdown',
	walk: 'aim.target_sorting',
	value: {
		'Crosshair + FOV': 'dist2d',
		'Nearest': 'dist3d',
		'Health': 'hp',
	},
});

Weapon.control('Aim FOV', {
	type: 'slider',
	walk: 'aim.fov',
	min: 1,
	max: 110,
	step: 1,
	labels: { 110: 'Maximum' },
});

Weapon.control('Draw FOV Area', {
	type: 'boolean',
	walk: 'aim.fov_box',
});

Weapon.control('Aim throught Walls', {
	type: 'boolean',
	walk: 'aim.wallbangs',
})







var Player = menu.tab('EXPLOITS');

Player.control('Soft Unlock All', {
	type: 'boolean',
	walk: 'player.skins',
});

Player.control('Object Opacity', {
	type: 'slider',
	walk: 'esp.walls',
	min: 0,
	max: 100,
	step: 1,
});

Player.control('Spinbot', {
	type: 'boolean',
	walk: 'aim.spinbot',
});

Player.control('Rapid Fire', {
	type: 'boolean',
	walk: 'aim.force_auto',
});

Player.control('Rapid Fire Delay', {
	type: 'slider',
	walk: 'aim.force_auto_rate',
	min: 0,
	max: 2,
	step: 0.1,
});

Player.control('Auto. Reload', {
	type: 'boolean',
	walk: 'aim.auto_reload',
});

Player.control('CSS Injector', {
	type: 'function',
	value() { menu.css_editor.show() },
});







var Game = menu.tab('MISC');

Game.control('Auto BHop', {
	type: 'dropdown',
	walk: 'player.bhop',
	value: {
		Off: 'off',
		'Key Jump': 'keyjump',
		'Autoslide': 'autoslide',
		'Áutojump': 'autojump',
		'Fastest BHop': 'keyslide',
	},
});

Game.control('Official Proxy', {
	type: 'boolean',
	walk: 'game.proxy',
}).on('click', (value, init) => !init && location.assign('/'));

Game.control('Activate Nuke Automaticly', {
	type: 'boolean',
	walk: 'game.auto_nuke',
});

Game.control('Auto Start Match', {
	type: 'boolean',
	walk: 'game.auto_start',
});

Game.control('New Lobby Finder', {
	type: 'boolean',
	walk: 'game.auto_lobby',
});

Game.control('No Inactivity Kick', {
	type: 'boolean',
	walk: 'game.inactivity',
});

Game.control('Error Bypassers', {
	type: 'boolean',
	walk: 'game.error_tips',
});

var Info = menu.tab('CHANGELOG');

/*
Info.control('GitHub', {
	type: 'link',
	value: meta.github,
});

Info.control('Discord', {
	type: 'link',
	value: meta.discord,
});

Info.control('Forum', {
	type: 'link',
	value: meta.forum,
});
*/

var Interface = menu.tab('CONFIGS');

Interface.control({
	type: 'functions',
	value: {
		Reset(){
			menu.load_preset('Default');
		},
		async Import(){
			var file = await File.pick({
					accept: 'menu.json',
				}),
				data = await file.read();
			
			try{
				await menu.insert_config(JSON.parse(data), true);
			}catch(err){
				console.error(err);
				alert('Invalid config');
			}
		},
		Export(){
			File.save({
				name: 'menu.json',
				data: JSON.stringify(menu.config),
			})
		},
	},
});

var Preset = Interface.control('Preset', {
	type: 'select',
	value: {},
}).select;

Preset.addEventListener('change', () => {
	if(Preset.value == 'Custom')return;
	
	menu.load_preset(Preset.value, { section: menu.config.section });
});

utils.add_ele('ez-option', Preset, { value: 'Custom' });

menu.on('add-preset', label => utils.add_ele('ez-option', Preset, { value: label }));

menu.on('config', () => {
	var Default = menu.presets.get('Default'),
		// remove excess such as .section
		string = JSON.stringify(utils.filter_deep(utils.clone_obj(menu.config), Default));
	
	for(let [ label, value ] of menu.presets){
		if(JSON.stringify(utils.assign_deep(utils.clone_obj(Default), value)) == string)return Preset.value = label;
	}
	
	Preset.value = 'Custom';
});

Interface.control('Menu Toggle', {
	type: 'keybind',
	walk: 'binds.toggle',
}).on('change', value => binds.toggle.set_key('F1', value));

Interface.control('Reset settings', {
	type: 'keybind',
	walk: 'binds.reset',
}).on('change', value => binds.reset.set_key(value));

menu.css_editor = new UI.Editor(frame, {
	help: [
		`<h3>Glossary:</h3><ul>`,
			`<li>Menu bar - set of buttons found in the top left of the menu.</li>`,
		`</ul>`,
		`<h3>What does this menu do?</h3>`,
		`<p>This is a CSS manager/ide for Krunker.</p>`,
		`<h3>How do I add my CSS?</h3>`,
		`<p>1. Press the svg.web button found in the menu bar.</p>`,
		`<p>2. In the new window, input the link to your CSS then press OK.</p>`,
		// `<p>3. Reload by pressing the svg.reload button in the menu bar.</p>`,
		`<h3>How do I manually add CSS?</h3>`,
		`<p>1. Create a new file with the svg.add_file button found in the top right of the CSS manager.<p>`,
		`<p>2. In the text editor, input your CSS.<p>`,
		`<p>3. When you are finished, press the svg.save button to save changes.<p>`,
		// `<p>4. Reload by pressing the svg.reload button in the menu bar.</p>`,
		'<h3>How do I turn on/off my CSS?</h3>',
		`<p>Pressing the square icon in your CSS's tab will toggle the visibility. When the square is filled, the tab is enabled, when the square is empty, the tab is disabled.<p>`,
		'<h3>How do I rename my CSS?</h3>',
		`<p>Pressing the svg.rename icon in your CSS's tab will change the tab to renaming mode. Type in the new name then press enter to save changes.<p>`,
		'<h3>How do I remove my CSS?</h3>',
		`<p>Pressing the svg.close icon in your CSS's tab will remove your CSS.<p>`,
		`<p>For further help, search or post on the forum found by <a target="_blank" href="${meta.forum}">clicking here</a>.<p>`,
	].join(''),
});

menu.add_preset('Default', {
	binds: {
		toggle: 'KeyC',
		reset: null,
	},
	aim: {
		status: 'off',
		offset: 'random',
		target_sorting: 'dist2d',
		smooth: 0.2,
		// percentage of screen
		fov_box: false,
		fov: 50,
		wallbangs: false,
		auto_reload: false,
		force_auto: false,
		force_auto_rate: 0.2,
		spinbot: false,
	},
	colors: {
		rainbow: false,
		risk: '#c000c0',
		hostile: '#1e1e1e',
		friendly: '#00FF00',
	},
	esp: {
		rainbow: false,
		wireframe: false,
		status: 'off',
		walls: 100,
		labels: false,
		tracers: false,
	},
	game: {
		proxy: false,
		auto_nuke: false,
		auto_lobby: false,
		auto_start: false,
		inactivity: false,
		error_tips: true,
		custom_loading: true,
	},
	player: {
		bhop: 'off',
		skins: false,
	},
});

menu.add_preset('Assist', {
	aim: {
		status: 'assist',
		fov: 25,
		offset: 'random',
		smooth: 0.5,
	},
	player: {
		bhop: 'keyslide',
	},
});

menu.add_preset('Rage', {
	esp: {
		status: 'full',
		tracers: true,
	},
	aim: {
		status: 'auto',
		fov: 110,
		smooth: 0,
		force_auto: true,
		auto_reload: true,
		wallbangs: true,
		offset: 'multi',
		spinbot: true,
	},
	player: {
		bhop: 'autoslide',
	},
});

module.exports = menu;