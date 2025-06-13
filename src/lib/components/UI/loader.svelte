<div class="loader-container">
	<div class="loader loader1"><span></span></div>
	<div class="loader loader2"><span></span></div>
	<div class="loader loader3"><i></i></div>
	<div class="loader loader4"><i></i></div>
</div>

<style>
	.loader-container {
		position: relative;
		width: 100%;
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		-webkit-box-reflect: below 0 linear-gradient(transparent, transparent, rgba(0, 0, 0, 0.333));
	}
	.loader {
		position: absolute;
		width: 200px;
		height: 200px;
		border-radius: 50%;
		animation: animate 2s linear infinite;
	}
	.loader1:before,
	.loader2:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 100%;
		background: linear-gradient(to top, transparent, rgba(0, 255, 249, 0.4));
		background-size: 100px 180px;
		background-repeat: no-repeat;
		border-top-left-radius: 100px;
		border-bottom-left-radius: 100px;
	}
	.loader2,
	.loader4 {
		animation-delay: -1s;
		filter: hue-rotate(290deg);
	}
	.loader i {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 20px;
		height: 20px;
		background: #00fff9;
		border-radius: 50%;
		z-index: 100;
		box-shadow:
			0 0 10px #00fff9,
			0 0 20px #00fff9,
			0 0 30px #00fff9,
			0 0 40px #00fff9,
			0 0 50px #00fff9,
			0 0 60px #00fff9,
			0 0 70px #00fff9,
			0 0 80px #00fff9,
			0 0 90px #00fff9,
			0 0 100px #00fff9;
	}
	.loader span {
		position: absolute;
		inset: 20px;
		background: #000;
		border-radius: 50%;
		z-index: 1;
	}
	@keyframes animate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
