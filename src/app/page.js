"use client"
import { La_Belle_Aurore } from 'next/font/google'
import './main-style.css'
import { useState } from 'react'


const Screen = ({ value, result }) => {
  return (
    <div className='screen'>
      <span className='operation-screen'>{value}</span>
      <span className='result-screen'>{result}</span>
    </div>
  )
}

const ButtonCalc = ({ children, fnOnClick, especialId='' }) => {
  return (
    <button type='button' id={especialId} className='key' onClick={fnOnClick}>{children}</button>
  )
}

export default function Home() {
  const [ screenValue, setScreenValue ] = useState('')
  const [ result, setResult ] = useState(0)
  const [ validators, setValidators ] = useState({
    preventOperator: true,
    preventDecimalPoint: true,
    isOperated: false
  })

  const operatorsList = ['+', '-', '*', '/']

  const showDigitOnScreen = (digit) => {
    let validatedValue = ''

    if (screenValue === '') {
      if (!isNaN(digit) || digit === '-') {
        validatedValue = digit
        setValidators({...validators, preventOperator: digit === '-' ? false : true})
      }
    
    } else if (screenValue.length >= 1) {
      if (!isNaN(digit)) {
        validatedValue = digit
        setValidators({...validators, preventOperator: true}) 
      
      } else if (operatorsList.includes(digit) && validators.preventOperator && !isNaN(screenValue[screenValue.length - 1])) {
        validatedValue = digit
        setValidators({...validators, preventOperator: false, preventDecimalPoint: true})
      
      } else if (digit === '.' && validators.preventDecimalPoint && !isNaN(screenValue[screenValue.length - 1])) {
        validatedValue = digit
        setValidators({...validators, preventDecimalPoint: false})
      }
    }

    setScreenValue(validators.isOperated ? result + validatedValue : screenValue + validatedValue)
    if (validators.isOperated) {
      setValidators({...validators, isOperated: false})
    }
  }

  const clearMemory = () => {
    setValidators({...validators, preventOperator: true, preventDecimalPoint: true, isOperated: false})
    setScreenValue('')
    setResult(0)
  }

  const mathOperation = (operation) => {
    if (operation === 'backspace') {
      let value = screenValue
      value = value.substring(0, value.length - 1)
      setScreenValue(value)
      setValidators({...validators, isOperated: false})
    }

    if (operation === 'equal') {
      try {
        let expression = screenValue
  
        if (isNaN(expression[expression.length - 1])) {
          expression = expression.substring(0, expression.length - 1)
          setScreenValue(expression)
        }

        const operationResult = eval(expression ? expression : 0)
        setResult(operationResult)
        setValidators({...validators, isOperated: true})
  
      } catch {
        setResult('ERRO')
      }
    }
  }

  const labels = ['C', '<', '/', '*', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.']

  const calcKeys = labels.map(label => {
    if (label === 'C') {
      return <ButtonCalc key={label} fnOnClick={() => clearMemory()} especialId='clear'>{label}</ButtonCalc>
    }

    if (label === '<' || label === '=') {
      const backspaceOrEqual = label === '<' ? 'backspace' : 'equal'
      return <ButtonCalc key={label} fnOnClick={() => mathOperation(backspaceOrEqual)} especialId={backspaceOrEqual}>{label === '<' ? <>&larr;</> : label}</ButtonCalc>
    }

    return <ButtonCalc key={label} fnOnClick={() => showDigitOnScreen(label)} especialId={label === '0' ? 'zero' : ''}>{label === '*' ? <>&times;</> : label === '/' ? <>&divide;</> : label}</ButtonCalc>
  })
  
  return (
    <main className='calc'>
      <h1>Calculadora</h1>
      <Screen value={screenValue} result={result}/>
      <div className='keyboard'>
        {calcKeys}
      </div>
    </main>
  )
}
