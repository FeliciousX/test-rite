import {div} from '@cycle/dom'
import xs from 'xstream'
import debounce from 'xstream/extra/debounce'

export function App (sources) {
  // intent
  const editable = sources.DOM.select( '.editable' )
  const dblClick$ = editable.events( 'dblclick' )
  const focus$ = editable.events( 'focus' )
  const blur$ = editable.events( 'blur' )
  const copy$ = editable.events( 'copy' ).debug( 'copy' ).mapTo( state => state );
  const paste$ = editable.events( 'paste' ).debug( 'paste' ).mapTo( state => state );
  const cut$ = editable.events( 'cut' ).debug( 'cut' ).mapTo( state => state );
  const input$ = editable.events( 'input' ).debug( 'input' ).mapTo( state => state );

  // reducers
  const startEdit$ = dblClick$.mapTo( state => ({ ...state, editing: true }) )
  const changeRed$ = focus$.mapTo( state => ({ ...state, backgroundColor: '#eeeeee' }) )
  const stopEdit$ = blur$.mapTo( state => ({ ...state, editing: false }) )

  const reducer$ = xs.merge( startEdit$, stopEdit$, changeRed$, paste$, cut$, copy$, input$ )


  // model
  const initState = {
    editing: false,
    backgroundColor: 'white',
    innerHTML: 'Hello there'
  }

  const state$ = reducer$.fold( (state, reducer) => reducer( state ), initState )


  // view
  const vtree$ = state$.map( state =>
    div({
      props: {
        contentEditable: state.editing,
        className: 'editable',
        innerHTML: state.innerHTML
      },
      style: {
        backgroundColor:  state.backgroundColor,
        fontSize: state.editing ? '30px' : '20px'
      }
    })
  )

  const sinks = {
    DOM: vtree$
  }

  return sinks
}
