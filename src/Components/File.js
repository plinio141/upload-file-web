import React, { Component } from 'react';
import InputFiles from 'react-input-files';

class File extends Component {
	render() {
		return (
			<div>
					<InputFiles onChange={files => console.log(files)}>
						<button>Upload</button>
					</InputFiles>;
			</div>
		);
	}
}

export default File;