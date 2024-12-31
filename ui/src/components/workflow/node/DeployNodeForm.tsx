import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Divider, Form, Select, Space, Tooltip, Typography } from "antd";
import { createSchemaFieldRule } from "antd-zod";
import { PlusOutlined as PlusOutlinedIcon, QuestionCircleOutlined as QuestionCircleOutlinedIcon } from "@ant-design/icons";
import { produce } from "immer";
import z from "zod";

import AccessEditModal from "@/components/access/AccessEditModal";
import AccessSelect from "@/components/access/AccessSelect";
import { usePanel } from "../PanelProvider";
import DeployNodeFormAliyunALBFields from "./DeployNodeFormAliyunALBFields";
import DeployNodeFormAliyunCLBFields from "./DeployNodeFormAliyunCLBFields";
import DeployNodeFormAliyunCDNFields from "./DeployNodeFormAliyunCDNFields";
import DeployNodeFormAliyunDCDNFields from "./DeployNodeFormAliyunDCDNFields";
import DeployNodeFormAliyunNLBFields from "./DeployNodeFormAliyunNLBFields";
import DeployNodeFormAliyunOSSFields from "./DeployNodeFormAliyunOSSFields";
import DeployNodeFormBaiduCloudCDNFields from "./DeployNodeFormBaiduCloudCDNFields";
import DeployNodeFormBytePlusCDNFields from "./DeployNodeFormBytePlusCDNFields";
import DeployNodeFormDogeCloudCDNFields from "./DeployNodeFormDogeCloudCDNFields";
import DeployNodeFormHuaweiCloudCDNFields from "./DeployNodeFormHuaweiCloudCDNFields";
import DeployNodeFormHuaweiCloudELBFields from "./DeployNodeFormHuaweiCloudELBFields";
import DeployNodeFormKubernetesSecretFields from "./DeployNodeFormKubernetesSecretFields";
import DeployNodeFormLocalFields from "./DeployNodeFormLocalFields";
import DeployNodeFormQiniuCDNFields from "./DeployNodeFormQiniuCDNFields";
import DeployNodeFormSSHFields from "./DeployNodeFormSSHFields";
import DeployNodeFormTencentCloudCDNFields from "./DeployNodeFormTencentCloudCDNFields";
import DeployNodeFormTencentCloudCLBFields from "./DeployNodeFormTencentCloudCLBFields";
import DeployNodeFormTencentCloudCOSFields from "./DeployNodeFormTencentCloudCOSFields";
import DeployNodeFormTencentCloudECDNFields from "./DeployNodeFormTencentCloudECDNFields";
import DeployNodeFormTencentCloudEOFields from "./DeployNodeFormTencentCloudEOFields";
import DeployNodeFormVolcEngineCDNFields from "./DeployNodeFormVolcEngineCDNFields";
import DeployNodeFormVolcEngineLiveFields from "./DeployNodeFormVolcEngineLiveFields";
import DeployNodeFormWebhookFields from "./DeployNodeFormWebhookFields";
import { useAntdForm, useZustandShallowSelector } from "@/hooks";
import { ACCESS_USAGES } from "@/domain/access";
import { accessProvidersMap, deployProvidersMap } from "@/domain/provider";
import { type WorkflowNode, type WorkflowNodeConfig } from "@/domain/workflow";
import { useWorkflowStore } from "@/stores/workflow";

export type DeployFormProps = {
  data: WorkflowNode;
  defaultProivderType?: string;
};

const initFormModel = (): WorkflowNodeConfig => {
  return {};
};

const DeployNodeForm = ({ data, defaultProivderType }: DeployFormProps) => {
  const { t } = useTranslation();

  const { updateNode, getWorkflowOuptutBeforeId } = useWorkflowStore(useZustandShallowSelector(["updateNode", "getWorkflowOuptutBeforeId"]));
  const { hidePanel } = usePanel();

  const formSchema = z.object({
    providerType: z
      .string({ message: t("workflow_node.deploy.form.provider_type.placeholder") })
      .nonempty(t("workflow_node.deploy.form.provider_type.placeholder")),
    access: z
      .string({ message: t("workflow_node.deploy.form.provider_access.placeholder") })
      .nonempty(t("workflow_node.deploy.form.provider_access.placeholder")),
    certificate: z.string({ message: t("workflow_node.deploy.form.certificate.placeholder") }).nonempty(t("workflow_node.deploy.form.certificate.placeholder")),
  });
  const formRule = createSchemaFieldRule(formSchema);
  const {
    form: formInst,
    formPending,
    formProps,
  } = useAntdForm<z.infer<typeof formSchema>>({
    initialValues: data?.config ?? initFormModel(),
    onSubmit: async (values) => {
      await formInst.validateFields();
      await updateNode(
        produce(data, (draft) => {
          draft.config = { ...values };
          draft.validated = true;
        })
      );
      hidePanel();
    },
  });

  const [previousOutput, setPreviousOutput] = useState<WorkflowNode[]>([]);
  useEffect(() => {
    const rs = getWorkflowOuptutBeforeId(data.id, "certificate");
    setPreviousOutput(rs);
  }, [data, getWorkflowOuptutBeforeId]);

  const fieldProviderType = Form.useWatch("providerType", formInst);
  // const fieldAccess = Form.useWatch("access", formInst);

  const formFieldsComponent = useMemo(() => {
    /*
      注意：如果追加新的子组件，请保持以 ASCII 排序。
      NOTICE: If you add new child component, please keep ASCII order.
     */
    switch (fieldProviderType) {
      case "aliyun-alb":
        return <DeployNodeFormAliyunALBFields />;
      case "aliyun-clb":
        return <DeployNodeFormAliyunCLBFields />;
      case "aliyun-cdn":
        return <DeployNodeFormAliyunCDNFields />;
      case "aliyun-dcdn":
        return <DeployNodeFormAliyunDCDNFields />;
      case "aliyun-nlb":
        return <DeployNodeFormAliyunNLBFields />;
      case "aliyun-oss":
        return <DeployNodeFormAliyunOSSFields />;
      case "baiducloud-cdn":
        return <DeployNodeFormBaiduCloudCDNFields />;
      case "byteplus-cdn":
        return <DeployNodeFormBytePlusCDNFields />;
      case "dogecloud-cdn":
        return <DeployNodeFormDogeCloudCDNFields />;
      case "huaweicloud-cdn":
        return <DeployNodeFormHuaweiCloudCDNFields />;
      case "huaweicloud-elb":
        return <DeployNodeFormHuaweiCloudELBFields />;
      case "k8s-secret":
        return <DeployNodeFormKubernetesSecretFields />;
      case "local":
        return <DeployNodeFormLocalFields />;
      case "qiniu-cdn":
        return <DeployNodeFormQiniuCDNFields />;
      case "ssh":
        return <DeployNodeFormSSHFields />;
      case "tencentcloud-cdn":
        return <DeployNodeFormTencentCloudCDNFields />;
      case "tencentcloud-clb":
        return <DeployNodeFormTencentCloudCLBFields />;
      case "tencentcloud-cos":
        return <DeployNodeFormTencentCloudCOSFields />;
      case "tencentcloud-ecdn":
        return <DeployNodeFormTencentCloudECDNFields />;
      case "tencentcloud-eo":
        return <DeployNodeFormTencentCloudEOFields />;
      case "volcengine-cdn":
        return <DeployNodeFormVolcEngineCDNFields />;
      case "volcengine-live":
        return <DeployNodeFormVolcEngineLiveFields />;
      case "webhook":
        return <DeployNodeFormWebhookFields />;
    }
  }, [fieldProviderType]);

  const handleProviderTypeSelect = (value: string) => {
    if (fieldProviderType === value) return;

    // 切换部署目标时重置表单，避免其他部署目标的配置字段影响当前部署目标
    if (data.config?.providerType === value) {
      formInst.resetFields();
    } else {
      const oldValues = formInst.getFieldsValue();
      const newValues: Record<string, unknown> = {};
      for (const key in oldValues) {
        if (key === "providerType" || key === "access" || key === "certificate") {
          newValues[key] = oldValues[key];
        } else {
          newValues[key] = undefined;
        }
      }
      formInst.setFieldsValue(newValues);
    }
  };

  return (
    <Form {...formProps} form={formInst} disabled={formPending} layout="vertical">
      <Form.Item name="providerType" label={t("workflow_node.deploy.form.provider_type.label")} rules={[formRule]} initialValue={defaultProivderType}>
        <Select
          showSearch
          placeholder={t("workflow_node.deploy.form.provider_type.placeholder")}
          filterOption={(searchValue, option) => {
            const type = String(option?.value ?? "");
            const target = deployProvidersMap.get(type);
            const filter = (v?: string) => v?.toLowerCase()?.includes(searchValue.toLowerCase()) ?? false;
            return filter(type) || filter(t(target?.name ?? ""));
          }}
          onSelect={handleProviderTypeSelect}
        >
          {Array.from(deployProvidersMap.values()).map((item) => {
            return (
              <Select.Option key={item.type} label={t(item.name)} value={item.type} title={t(item.name)}>
                <Space className="flex-grow max-w-full truncate" size={4}>
                  <Avatar src={item.icon} size="small" />
                  <Typography.Text className="leading-loose" ellipsis>
                    {t(item.name)}
                  </Typography.Text>
                </Space>
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item className="mb-0">
        <label className="block mb-1">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex-grow max-w-full truncate">
              <span>{t("workflow_node.deploy.form.provider_access.label")}</span>
              <Tooltip title={t("workflow_node.deploy.form.provider_access.tooltip")}>
                <Typography.Text className="ms-1" type="secondary">
                  <QuestionCircleOutlinedIcon />
                </Typography.Text>
              </Tooltip>
            </div>
            <div className="text-right">
              <AccessEditModal
                data={{ configType: deployProvidersMap.get(defaultProivderType!)?.provider }}
                preset="add"
                trigger={
                  <Button size="small" type="link">
                    <PlusOutlinedIcon />
                    {t("workflow_node.deploy.form.provider_access.button")}
                  </Button>
                }
                onSubmit={(record) => {
                  const provider = accessProvidersMap.get(record.configType);
                  if (ACCESS_USAGES.ALL === provider?.usage || ACCESS_USAGES.DEPLOY === provider?.usage) {
                    formInst.setFieldValue("access", record.id);
                  }
                }}
              />
            </div>
          </div>
        </label>
        <Form.Item name="access" rules={[formRule]}>
          <AccessSelect
            placeholder={t("workflow_node.deploy.form.provider_access.placeholder")}
            filter={(record) => {
              if (defaultProivderType) {
                return deployProvidersMap.get(defaultProivderType)?.provider === record.configType;
              }

              const provider = accessProvidersMap.get(record.configType);
              return ACCESS_USAGES.ALL === provider?.usage || ACCESS_USAGES.APPLY === provider?.usage;
            }}
          />
        </Form.Item>
      </Form.Item>

      <Form.Item
        name="certificate"
        label={t("workflow_node.deploy.form.certificate.label")}
        rules={[formRule]}
        tooltip={<span dangerouslySetInnerHTML={{ __html: t("workflow_node.deploy.form.certificate.tooltip") }}></span>}
      >
        <Select
          options={previousOutput.map((item) => {
            return {
              label: item.name,
              options: item.output?.map((output) => {
                return {
                  label: `${item.name} - ${output.label}`,
                  value: `${item.id}#${output.name}`,
                };
              }),
            };
          })}
          placeholder={t("workflow_node.deploy.form.certificate.placeholder")}
        />
      </Form.Item>

      <Divider className="my-1">
        <Typography.Text className="font-normal text-xs" type="secondary">
          {t("workflow_node.deploy.form.params_config.label")}
        </Typography.Text>
      </Divider>

      {formFieldsComponent}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={formPending}>
          {t("common.button.save")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default memo(DeployNodeForm);
