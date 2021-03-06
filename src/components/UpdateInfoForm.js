import React from 'react';
import { Upload, Icon, Form, Input, Select, Button, message } from 'antd';
import {API_ROOT, TOKEN_KEY} from "../constants";
import $ from 'jquery';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;
const Dragger = Upload.Dragger;

class UpdateInfoForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        validateStatus: '',
        validateMessage: '',
        fileList: [],
        uploading: false,
    };

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file);
            console.log(file);
        });
        formData.set('semail', this.props.username);
        formData.set('token', localStorage.getItem(TOKEN_KEY));

        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        $.ajax({
            url: `${API_ROOT}/student/uploadResume.php`,
            method: 'POST',
            processData: false,
            data: formData,
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,

        }).then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }


    componentDidUpdate() {
        console.log(this.props.info);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                $.ajax({
                    url: `${API_ROOT}/student/updateStudentProfile.php`,
                    method: 'POST',
                    data: {
                        usertype: this.props.usertype,
                        semail: values.semail,
                        skey: values.skey,
                        sfirstname: values.sfirstname,
                        slastname: values.slastname,
                        sgpa: values.sgpa,
                        sphone: values.sphone,
                        suniversity: values.suniversity,
                        smajor: values.smajor,
                        sresume: values.sresume,
                        token: localStorage.getItem(TOKEN_KEY),
                    },
                }).then((response) => {
                    message.success(response);
                    console.log(response);
                    this.props.closeModal();
                }, (response) => {
                    console.log(response);
                    message.error(response.responseText);
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('skey')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        console.log("render:", this.props.info);
        const { getFieldDecorator } = this.props.form;

        const { uploading } = this.state;
        const props = {
            action: '//jsonplaceholder.typicode.com/posts/',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList,
        };

        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '1',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="1">+1</Option>
            </Select>
        );

        return (
            <div className='update-form'>
                <div className='form-wrapper'>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            hasFeedback
                            validateStatus={this.state.validateStatus}
                        >
                            {getFieldDecorator('semail', {
                                rules: [{
                                    required: true,
                                    message: this.state.validateMessage,
                                    whitespace: true,
                                    validator: this.checkEmail,
                                }],
                                initialValue: this.props.username,
                            })(
                                <Input placeholder={this.props.username} disabled/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('sfirstname', {
                                rules: [{ required: true, message: 'Please input your firstname.', whitespace: true }],
                                initialValue: this.props.info.sfirstname,
                            })(
                                <Input placeholder="First Name"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('slastname', {
                                rules: [{ required: true, message: 'Please input your lastname.', whitespace: true }],
                                initialValue: this.props.info.slastname,
                            })(
                                <Input placeholder="Last Name"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('skey', {
                                rules: [{
                                    required: true, message: 'Please input your password.',
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input placeholder="Password" type="password"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: 'Please confirm your password.',
                                }, {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input placeholder="Confirm Password" type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('sphone', {
                                rules: [{ required: true, message: 'Please input your phone number.' }],
                                initialValue: this.props.info.sphone,
                            })(
                                <Input placeholder="Phone Number" addonBefore={prefixSelector} style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('suniversity', {
                                initialValue: this.props.info.suniversity,
                            })(
                                <Input placeholder="University"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('smajor', {
                                initialValue: this.props.info.smajor,
                            })(
                                <Input placeholder="Major" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('sgpa', {
                                initialValue: this.props.info.sgpa,
                            })(
                                <Input placeholder="GPA" />
                            )}
                        </FormItem>
                        <div className="upload">
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload" /> Select Resume
                                </Button>
                            </Upload>
                            <Button
                                className="upload-demo-start"
                                type="primary"
                                onClick={this.handleUpload}
                                disabled={this.state.fileList.length === 0}
                                loading={uploading}
                            >
                                {uploading ? 'Uploading' : 'Start Upload' }
                            </Button>
                        </div>
                        <FormItem>
                            <Button className="update-button" type="primary" htmlType="submit">Update</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export const UpdateForm = Form.create()(UpdateInfoForm);