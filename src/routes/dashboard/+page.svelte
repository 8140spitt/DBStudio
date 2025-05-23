<div class="filing-cabinet-tabs">
	<button class="tab active">File 1</button>
	<button class="tab">File 2</button>
	<button class="tab">File 3</button>
	<button class="tab">File 4</button>
</div>
<div class="tab-content">
	<!-- Put your tab panel content here -->
	<p>This is the content area for the active tab.</p>
</div>

<style>
	.filing-cabinet-tabs {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
		margin-bottom: -10px; /* Let tabs overlap the content slightly */
	}

	.tab {
		position: relative;
		background: #f5f6fa;
		border: 2px solid #b0b5be;
		border-bottom: none;
		border-radius: 10px 10px 0 0;
		padding: 0.75rem 1.5rem 0.6rem 1.5rem;
		font-size: 1rem;
		font-weight: 500;
		box-shadow: 0 2px 6px rgba(70, 70, 70, 0.06);
		cursor: pointer;
		z-index: 1;
		transition:
			background 0.15s,
			box-shadow 0.15s;
		margin-bottom: 0;
	}

	.tab:not(.active) {
		background: #e1e5ec;
		color: #6c7383;
		z-index: 0;
	}

	.tab.active {
		background: #fff;
		color: #222d3c;
		box-shadow: 0 6px 16px rgba(70, 70, 70, 0.15);
		z-index: 2;
	}

	.tab:before {
		content: '';
		position: absolute;
		left: -10px;
		top: 0;
		width: 10px;
		height: 100%;
		background: transparent;
		border-top-left-radius: 10px;
	}

	.tab:after {
		content: '';
		position: absolute;
		right: -10px;
		top: 0;
		width: 10px;
		height: 100%;
		background: transparent;
		border-top-right-radius: 10px;
	}

	.tab-content {
		background: #fff;
		border: 2px solid #b0b5be;
		border-radius: 0 0 10px 10px;
		padding: 2rem;
		box-shadow: 0 6px 16px rgba(70, 70, 70, 0.07);
	}
</style>
