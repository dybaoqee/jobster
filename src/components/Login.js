import React from 'react';
import $ from 'jquery';
import { Form, Icon, Input, Button, Radio, message } from 'antd';
import { API_ROOT } from '../constants';
import { Link } from 'react-router-dom'


const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                $.ajax({
                    url: `${API_ROOT}/login.php`,
                    method: 'POST',
                    data: {
                        username: values.username,
                        keywords: values.password,
                        usertype: values.usertype,
                    },
                }).then((response) => {
                    this.props.handleLogin(response, values.username);  //response is a token;
                }, (error) => {
                    message.error(error.responseText);
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    }

    componentDidMount() {
        this.props.setUserType();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='login-register'>
                <div className='form-wrapper'>
                    <div className="login-title">Discover your future</div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('usertype')(
                                <RadioGroup className="user-type">
                                    <RadioButton
                                        value="student"
                                        onClick={this.props.handleOnClickStudent}
                                    >Student</RadioButton>
                                    <RadioButton
                                        value="company"
                                        onClick={this.props.handleOnClickCompany}
                                    >Company</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                       placeholder="Username"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock"
                                                     style={{ color: 'rgba(0,0,0,.25)' }}
                                />}
                                       type="password" placeholder="Password"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })}
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                            Or <Link to="/register">register now!</Link>
                        </FormItem>
                    </Form>
                </div>

            </div>
        );
    }
}

export const Login = Form.create()(NormalLoginForm);