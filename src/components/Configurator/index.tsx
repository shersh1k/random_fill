import React from 'react';
import { useDispatch } from 'react-redux';
import { setConfig } from '../../store/game/actions';
import { Form, Button, Input, InputNumber, Space, Card } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './Configurator.css';

function Configurator() {
  const dispatch = useDispatch();
  const submit = ({ x, y, players }: Store) => dispatch(setConfig({ x, y, players }));
  return (
    <Form
      initialValues={{ x: 20, y: 20, players: ['Player 1', 'Player 2'] }}
      onFinish={submit}
      className='configurator'>
      <Card title={'Configurator'}>
        <Space direction='vertical'>
          <Form.Item
            {...layout}
            label='Cells horizontaly'
            name='x'
            rules={[{ required: true, message: 'Please, input Y cells' }]}>
            <InputNumber min={20} max={100} />
          </Form.Item>
          <Form.Item
            {...layout}
            label='Cells verticaly'
            name='y'
            rules={[{ required: true, message: 'Please, input X cells' }]}>
            <InputNumber min={20} max={100} />
          </Form.Item>
          <Form.List name='players'>
            {(fields, { add, remove }) => {
              return (
                <div style={{ minHeight: 224, minWidth: 270 }}>
                  {fields.map((field, index) => (
                    <Form.Item label={`Player ${index + 1}`} required={true} key={field.key}>
                      <Form.Item
                        {...field}
                        initialValue={`Player ${index + 1}`}
                        rules={[{ required: true, message: `Please input player's name.` }]}
                        noStyle>
                        <Input placeholder='player name' style={{ width: '90%' }} />
                      </Form.Item>
                      {fields.length > 2 ? (
                        <MinusCircleOutlined
                          style={{ marginLeft: 5 }}
                          title='Remove player'
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  {fields.length < 4 ? (
                    <Form.Item>
                      <Button title='Add player' type='dashed' onClick={() => add()}>
                        <PlusOutlined /> Add player
                      </Button>
                    </Form.Item>
                  ) : null}
                </div>
              );
            }}
          </Form.List>

          <Form.Item>
            <Button type='primary' block htmlType='submit' title='Start game'>
              Start
            </Button>
          </Form.Item>
        </Space>
      </Card>
    </Form>
  );
}

export default Configurator;

const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};
