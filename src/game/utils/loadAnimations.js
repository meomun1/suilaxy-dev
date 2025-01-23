export const createAnimationIfNotExists = (
	scene,
	key,
	textureKey,
	start,
	end,
	frameRate,
	repeat,
	hideOnComplete,
) => {
	if (!scene.anims.exists(key)) {
		scene.anims.create({
			key: key,
			frames: scene.anims.generateFrameNumbers(textureKey, {
				start: start,
				end: end,
			}),
			frameRate: frameRate,
			repeat: repeat,
			hideOnComplete: hideOnComplete,
		})
	}
}

export const createAnimationForLoading = (scene) => {
	const bulletAnimations = {
		1: {
			key: 'bullet1_anim',
			textureKey: 'bullet1_texture',
			start: 0,
			end: 1,
			frameRate: 12,
			repeat: -1,
		},
		2: {
			key: 'bullet2_anim',
			textureKey: 'bullet2_texture',
			start: 0,
			end: 5,
			frameRate: 30,
			repeat: -1,
		},
		3: {
			key: 'bullet3_anim',
			textureKey: 'bullet3_texture',
			start: 0,
			end: 4,
			frameRate: 30,
			repeat: -1,
		},
		4: {
			key: 'bullet4_anim',
			textureKey: 'bullet4_texture',
			start: 0,
			end: 5,
			frameRate: 20,
			repeat: -1,
		},
		5: {
			key: 'bullet5_anim',
			textureKey: 'bullet5_texture',
			start: 0,
			end: 3,
			frameRate: 30,
			repeat: -1,
		},
		6: {
			key: 'bullet6_anim',
			textureKey: 'bullet6_texture',
			start: 0,
			end: 2,
			frameRate: 12,
			repeat: -1,
		},
		7: {
			key: 'bullet7_anim',
			textureKey: 'bullet7_texture',
			start: 0,
			end: 3,
			frameRate: 30,
			repeat: -1,
		},
		8: {
			key: 'bullet8_anim',
			textureKey: 'bullet8_texture',
			start: 0,
			end: 5,
			frameRate: 30,
			repeat: -1,
		},
		9: {
			key: 'bullet9_anim',
			textureKey: 'bullet9_texture',
			start: 0,
			end: 3,
			frameRate: 30,
			repeat: -1,
		},
	}

	const bulletAnimation = bulletAnimations[scene.selectedPlayerIndex]
	if (bulletAnimation) {
		createAnimationIfNotExists(
			scene,
			bulletAnimation.key,
			bulletAnimation.textureKey,
			bulletAnimation.start,
			bulletAnimation.end,
			bulletAnimation.frameRate,
			bulletAnimation.repeat,
		)
	}

	const playerAnimations = [
		{ key: 'player_anim', start: 0, end: 3 },
		{ key: 'player_anim_left', start: 4, end: 7 },
		{ key: 'player_anim_left_diagonal', start: 8, end: 11 },
		{ key: 'player_anim_right', start: 12, end: 15 },
		{ key: 'player_anim_right_diagonal', start: 16, end: 19 },
	]

	playerAnimations.forEach((anim) => {
		createAnimationIfNotExists(
			scene,
			anim.key,
			`player_texture_${scene.selectedPlayerIndex}`,
			anim.start,
			anim.end,
			30,
			-1,
		)
	})

	const effectAnimations = {
		1: {
			key: 'effect1_anim',
			textureKey: 'effect1_texture',
			start: 45,
			end: 59,
			frameRate: 14,
			repeat: 0,
			hideOnComplete: true,
		},
		2: {
			key: 'effect2_anim',
			textureKey: 'effect2_texture',
			start: 14,
			end: 27,
			frameRate: 20,
			repeat: 1,
			hideOnComplete: true,
		},
		3: {
			key: 'effect3_anim',
			textureKey: 'effect3_texture',
			start: 0,
			end: 19,
			frameRate: 20,
			repeat: 0,
			hideOnComplete: true,
		},
		4: {
			key: 'effect4_anim',
			textureKey: 'effect4_texture',
			start: 0,
			end: 12,
			frameRate: 13,
			repeat: 0,
			hideOnComplete: true,
		},
		5: {
			key: 'effect5_anim',
			textureKey: 'effect5_texture',
			start: 0,
			end: 15,
			frameRate: 16,
			repeat: 0,
			hideOnComplete: true,
		},
		6: {
			key: 'effect6_anim',
			textureKey: 'effect6_texture',
			start: 0,
			end: 29,
			frameRate: 30,
			repeat: 0,
			hideOnComplete: true,
		},
		7: {
			key: 'effect7_anim',
			textureKey: 'effect7_texture',
			start: 55,
			end: 65,
			frameRate: 10,
			repeat: 0,
			hideOnComplete: true,
		},
		8: {
			key: 'effect8_anim',
			textureKey: 'effect8_texture',
			start: 0,
			end: 29,
			frameRate: 30,
			repeat: 0,
			hideOnComplete: true,
		},
		9: {
			key: 'effect9_anim',
			textureKey: 'effect9_texture',
			start: 0,
			end: 29,
			frameRate: 30,
			repeat: 0,
			hideOnComplete: true,
		},
	}

	const effectAnimation = effectAnimations[scene.selectedPlayerIndex]
	if (effectAnimation) {
		createAnimationIfNotExists(
			scene,
			effectAnimation.key,
			effectAnimation.textureKey,
			effectAnimation.start,
			effectAnimation.end,
			effectAnimation.frameRate,
			effectAnimation.repeat,
			effectAnimation.hideOnComplete,
		)
	}

	const animations = [
		{
			key: 'bulletChase_anim',
			textureKey: 'bulletChase_texture',
			start: 0,
			end: 16,
			frameRate: 32,
			repeat: -1,
		},
		{
			key: 'boss_move_anim',
			textureKey: 'boss_texture',
			start: 0,
			end: 3,
			frameRate: 20,
			repeat: -1,
		},
		{
			key: 'boss_shoot_anim',
			textureKey: 'boss_texture',
			start: 0,
			end: 7,
			frameRate: 20,
			repeat: -1,
		},
		{
			key: 'bug1_anim',
			textureKey: 'bug1_texture',
			start: 0,
			end: 5,
			frameRate: 20,
			repeat: -1,
		},
		{
			key: 'bug3_anim',
			textureKey: 'bug3_texture',
			start: 0,
			end: 5,
			frameRate: 20,
			repeat: -1,
		},
		{
			key: 'bug5_anim',
			textureKey: 'bug5_texture',
			start: 0,
			end: 5,
			frameRate: 20,
			repeat: -1,
		},
		{
			key: 'healthPack_anim',
			textureKey: 'healthPack_texture',
			start: 0,
			end: 4,
			frameRate: 20,
			repeat: -1,
		},
		{
			key: 'shieldPack_anim',
			textureKey: 'shieldPack_texture',
			start: 0,
			end: 4,
			frameRate: 20,
			repeat: -1,
		},
		{
			key: 'shield_anim',
			textureKey: 'shield_texture',
			start: 0,
			end: 5,
			frameRate: 20,
			repeat: -1,
		},
		{
			key: 'explosion_anim',
			textureKey: 'explosion_texture',
			start: 0,
			end: 10,
			frameRate: 30,
			repeat: 0,
			hideOnComplete: true,
		},
		{
			key: 'pauseDis_anim',
			textureKey: 'pauseDis_texture',
			start: 0,
			end: 1,
			frameRate: 60,
			repeat: 0,
			hideOnComplete: true,
		},
	]

	animations.forEach((anim) => {
		createAnimationIfNotExists(
			scene,
			anim.key,
			anim.textureKey,
			anim.start,
			anim.end,
			anim.frameRate,
			anim.repeat,
			anim.hideOnComplete,
		)
	})

	createAnimationIfNotExists(
		scene,
		'bounce_effect_anim',
		'bounce_effect_texture',
		0,
		41,
		60,
		0,
		true,
	)
	createAnimationIfNotExists(
		scene,
		'electric_effect_anim',
		'electric_effect_texture',
		0,
		41,
		20,
		0,
		true,
	)
	createAnimationIfNotExists(
		scene,
		'time_effect_anim',
		'time_effect_texture',
		0,
		45,
		45,
		0,
		true,
	)
	createAnimationIfNotExists(
		scene,
		'poison_effect_anim',
		'poison_effect_texture',
		0,
		41,
		20,
		0,
		true,
	)
}
