import { useTranslation } from "react-i18next";
import { Form, type FormInstance, Input } from "antd";
import { createSchemaFieldRule } from "antd-zod";
import { z } from "zod";

import { validDomainName } from "@/utils/validators";

type DeployNodeConfigFormTencentCloudCSSConfigFieldValues = Nullish<{
  domain: string;
}>;

export type DeployNodeConfigFormTencentCloudCSSConfigProps = {
  form: FormInstance;
  formName: string;
  disabled?: boolean;
  initialValues?: DeployNodeConfigFormTencentCloudCSSConfigFieldValues;
  onValuesChange?: (values: DeployNodeConfigFormTencentCloudCSSConfigFieldValues) => void;
};

const initFormModel = (): DeployNodeConfigFormTencentCloudCSSConfigFieldValues => {
  return {};
};

const DeployNodeConfigFormTencentCloudCSSConfig = ({
  form: formInst,
  formName,
  disabled,
  initialValues,
  onValuesChange,
}: DeployNodeConfigFormTencentCloudCSSConfigProps) => {
  const { t } = useTranslation();

  const formSchema = z.object({
    domain: z
      .string({ message: t("workflow_node.deploy.form.tencentcloud_css_domain.placeholder") })
      .refine((v) => validDomainName(v, { allowWildcard: true }), t("common.errmsg.domain_invalid")),
  });
  const formRule = createSchemaFieldRule(formSchema);

  const handleFormChange = (_: unknown, values: z.infer<typeof formSchema>) => {
    onValuesChange?.(values);
  };

  return (
    <Form
      form={formInst}
      disabled={disabled}
      initialValues={initialValues ?? initFormModel()}
      layout="vertical"
      name={formName}
      onValuesChange={handleFormChange}
    >
      <Form.Item
        name="domain"
        label={t("workflow_node.deploy.form.tencentcloud_css_domain.label")}
        rules={[formRule]}
        tooltip={<span dangerouslySetInnerHTML={{ __html: t("workflow_node.deploy.form.tencentcloud_css_domain.tooltip") }}></span>}
      >
        <Input placeholder={t("workflow_node.deploy.form.tencentcloud_css_domain.placeholder")} />
      </Form.Item>
    </Form>
  );
};

export default DeployNodeConfigFormTencentCloudCSSConfig;
