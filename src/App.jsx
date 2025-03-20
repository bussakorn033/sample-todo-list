import { useState, useEffect } from 'react'
import { Button, Card, ConfigProvider, Progress } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import './App.css'

const initialItems = [
  { type: 'Fruit', name: 'Apple' },
  { type: 'Vegetable', name: 'Broccoli' },
  { type: 'Vegetable', name: 'Mushroom' },
  { type: 'Fruit', name: 'Banana' },
  { type: 'Vegetable', name: 'Tomato' },
  { type: 'Fruit', name: 'Orange' },
  { type: 'Fruit', name: 'Mango' },
  { type: 'Fruit', name: 'Pineapple' },
  { type: 'Vegetable', name: 'Cucumber' },
  { type: 'Fruit', name: 'Watermelon' },
  { type: 'Vegetable', name: 'Carrot' }
]

function App() {
  const [mainList, setMainList] = useState(initialItems)
  const [fruitList, setFruitList] = useState([])
  const [vegetableList, setVegetableList] = useState([])
  const [timeUpdate, setTimeUpdate] = useState(Date.now())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeUpdate(Date.now())
    }, 10)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const timers = new Set()

    const checkAndMoveBack = () => {
      const currentTime = Date.now()
      
      fruitList.forEach(item => {
        if (currentTime - item.timestamp >= 5000) {
          setMainList(prev => [...prev, { type: item.type, name: item.name }])
          setFruitList(prev => prev.filter(i => i.name !== item.name))
        }
      })

      vegetableList.forEach(item => {
        if (currentTime - item.timestamp >= 5000) {
          setMainList(prev => [...prev, { type: item.type, name: item.name }])
          setVegetableList(prev => prev.filter(i => i.name !== item.name))
        }
      })
    }

    const intervalId = setInterval(checkAndMoveBack, 10)
    return () => {
      clearInterval(intervalId)
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [fruitList, vegetableList])

  const handleMainListClick = (item) => {
    setMainList(prev => prev.filter(i => i.name !== item.name))
    const itemWithTimestamp = { ...item, timestamp: Date.now() }
    
    if (item.type === 'Fruit') {
      setFruitList(prev => [...prev, itemWithTimestamp])
    } else {
      setVegetableList(prev => [...prev, itemWithTimestamp])
    }
  }

  const handleColumnClick = (item, type) => {
    if (type === 'Fruit') {
      setFruitList(prev => prev.filter(i => i.name !== item.name))
    } else {
      setVegetableList(prev => prev.filter(i => i.name !== item.name))
    }
    setMainList(prev => [...prev, { type: item.type, name: item.name }])
  }

  const calculateTimeLeft = (timestamp) => {
    const timeLeft = Math.max(0, 5000 - (Date.now() - timestamp))
    return Math.ceil(timeLeft / 1000)
  }

  const renderItemWithCountdown = (item, type) => {
    const timeLeft = calculateTimeLeft(item.timestamp)
    const percent = timeLeft * 20
    
    return (
      <Button 
        key={item.name}
        onClick={() => handleColumnClick(item, type)}
        type="default"
        block
        style={{ display: 'flex', padding: '8px 16px' }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%',
          flexDirection: 'row',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeftOutlined />
            <span>{item.name}</span>
          </div>
          <Progress 
            type="circle" 
            percent={percent}
            format={() => `${timeLeft}s`}
            size={30}
            strokeWidth={12}
            strokeColor={{
              '0%': '#a6dbf8',
              '100%': '#016aa1',
            }}
            trailColor="#d6d6d6"
            strokeLinecap="round"
          />
        </div>
      </Button>
    )
  }

  const theme = {
    token: {
      colorPrimary: '#016aa1',
      colorBgContainer: '#fff',
    },
  }

  return (
    <ConfigProvider theme={theme}>
      <div className="container">
        <div className="columns">

          <Card title="Main List" className="column-card">
            <div className="button-container">
              {mainList.map(item => (
                <Button 
                  key={item.name}
                  onClick={() => handleMainListClick(item)}
                  type="dashed"
                  block
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </Card>

          <Card title="Fruits" className="column-card">
            <div className="button-container">
              {fruitList.map(item => renderItemWithCountdown(item, 'Fruit'))}
            </div>
          </Card>

          <Card title="Vegetables" className="column-card">
            <div className="button-container">
              {vegetableList.map(item => renderItemWithCountdown(item, 'Vegetable'))}
            </div>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default App