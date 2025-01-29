export const createText = (key, x, y, time, scene) => {
	const text = scene.add
		.text(x, y, key, {
			fontFamily: 'Pixelify Sans',
			fontSize: '32px',
			fill: '#FFFB73',
		})
		.setOrigin(0.5)

	scene.time.delayedCall(
		time,
		() => {
			text.destroy()
		},
		null,
		scene,
	)
}

export const createDelayText = (key, x, y, timeCalled, duration, scene) => {
	scene.time.delayedCall(timeCalled, () => {
		createText(key, x, y, duration, scene)
	})
}
