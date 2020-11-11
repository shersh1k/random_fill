import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { authorization } from '../../store/user/actions';
import { Store } from 'antd/lib/form/interface';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default function Authorization() {
    const dispatch = useDispatch();

    const onFinish = (values: Store) => {
        dispatch(authorization({ mail: values.email, password: values.password }))
    }

    const onFinishFailed = () => {
        notification.error({
            message: 'Error!',
            description: 'Fill all fields!'
        })
    }

    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
        </Button>
            </Form.Item>
        </Form>
    );
}
