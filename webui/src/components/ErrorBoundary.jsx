import { Component } from 'react'
import { reportError } from '../lib/logger.js'

/* INFO: Last line of defence. A render error shows a plain fallback instead of a blank page,
         and the error is written to the module's log file. The text is English on purpose,
         because the translations may be what failed. */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    reportError(error && error.message ? error.message : 'Render error', `${error && error.stack ? error.stack : ''}\n${info.componentStack || ''}`)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className='fatal' role='alert'>
        <h1 className='fatal-title'>ReZygisk</h1>
        <p className='fatal-text'>Something went wrong while drawing this page. The details were written to the log file.</p>
        <button type='button' className='btn btn--filled' onClick={() => window.location.reload()}>
          <span>Reload</span>
        </button>
      </div>
    )
  }
}
