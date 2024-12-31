import { useTranslation } from "react-i18next";
import { Form, Input, Select } from "antd";
import { createSchemaFieldRule } from "antd-zod";
import { z } from "zod";

import Show from "@/components/Show";
import { validDomainName } from "@/utils/validators";

const RESOURCE_TYPE_SSLDEPLOY = "ssl-deploy" as const;
const RESOURCE_TYPE_LOADBALANCER = "loadbalancer" as const;
const RESOURCE_TYPE_LISTENER = "listener" as const;
const RESOURCE_TYPE_RULEDOMAIN = "ruledomain" as const;

const DeployNodeFormTencentCloudCLBFields = () => {
  const { t } = useTranslation();

  const formSchema = z.object({
    resourceType: z.union(
      [z.literal(RESOURCE_TYPE_SSLDEPLOY), z.literal(RESOURCE_TYPE_LOADBALANCER), z.literal(RESOURCE_TYPE_LISTENER), z.literal(RESOURCE_TYPE_RULEDOMAIN)],
      { message: t("workflow_node.deploy.form.tencentcloud_clb_resource_type.placeholder") }
    ),
    region: z
      .string({ message: t("workflow_node.deploy.form.tencentcloud_clb_region.placeholder") })
      .nonempty(t("workflow_node.deploy.form.tencentcloud_clb_region.placeholder"))
      .trim(),
    loadbalancerId: z
      .string()
      .min(1, t("workflow_node.deploy.form.tencentcloud_clb_loadbalancer_id.placeholder"))
      .max(64, t("common.errmsg.string_max", { max: 64 }))
      .trim(),
    listenerId: z
      .string()
      .max(64, t("common.errmsg.string_max", { max: 64 }))
      .trim()
      .nullish()
      .refine(
        (v) => ![RESOURCE_TYPE_SSLDEPLOY, RESOURCE_TYPE_LISTENER, RESOURCE_TYPE_RULEDOMAIN].includes(fieldResourceType) || !!v?.trim(),
        t("workflow_node.deploy.form.tencentcloud_clb_listener_id.placeholder")
      ),
    domain: z
      .string({ message: t("workflow_node.deploy.form.tencentcloud_clb_domain.placeholder") })
      .nullish()
      .refine((v) => RESOURCE_TYPE_RULEDOMAIN !== fieldResourceType || validDomainName(v!, true), t("common.errmsg.domain_invalid")),
  });
  const formRule = createSchemaFieldRule(formSchema);
  const formInst = Form.useFormInstance();

  const fieldResourceType = Form.useWatch("resourceType", formInst);

  return (
    <>
      <Form.Item name="resourceType" label={t("workflow_node.deploy.form.tencentcloud_clb_resource_type.label")} rules={[formRule]}>
        <Select placeholder={t("workflow_node.deploy.form.tencentcloud_clb_resource_type.placeholder")}>
          <Select.Option key={RESOURCE_TYPE_SSLDEPLOY} value={RESOURCE_TYPE_SSLDEPLOY}>
            {t("workflow_node.deploy.form.tencentcloud_clb_resource_type.option.ssl_deploy.label")}
          </Select.Option>
          <Select.Option key={RESOURCE_TYPE_LOADBALANCER} value={RESOURCE_TYPE_LOADBALANCER}>
            {t("workflow_node.deploy.form.tencentcloud_clb_resource_type.option.loadbalancer.label")}
          </Select.Option>
          <Select.Option key={RESOURCE_TYPE_LISTENER} value={RESOURCE_TYPE_LISTENER}>
            {t("workflow_node.deploy.form.tencentcloud_clb_resource_type.option.listener.label")}
          </Select.Option>
          <Select.Option key={RESOURCE_TYPE_RULEDOMAIN} value={RESOURCE_TYPE_RULEDOMAIN}>
            {t("workflow_node.deploy.form.tencentcloud_clb_resource_type.option.ruledomain.label")}
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="region"
        label={t("workflow_node.deploy.form.tencentcloud_clb_region.label")}
        rules={[formRule]}
        tooltip={<span dangerouslySetInnerHTML={{ __html: t("workflow_node.deploy.form.tencentcloud_clb_region.tooltip") }}></span>}
      >
        <Input placeholder={t("workflow_node.deploy.form.tencentcloud_clb_region.placeholder")} />
      </Form.Item>

      <Form.Item
        name="loadbalancerId"
        label={t("workflow_node.deploy.form.tencentcloud_clb_loadbalancer_id.label")}
        rules={[formRule]}
        tooltip={<span dangerouslySetInnerHTML={{ __html: t("workflow_node.deploy.form.tencentcloud_clb_loadbalancer_id.tooltip") }}></span>}
      >
        <Input placeholder={t("workflow_node.deploy.form.tencentcloud_clb_loadbalancer_id.placeholder")} />
      </Form.Item>

      <Show
        when={fieldResourceType === RESOURCE_TYPE_SSLDEPLOY || fieldResourceType === RESOURCE_TYPE_LISTENER || fieldResourceType === RESOURCE_TYPE_RULEDOMAIN}
      >
        <Form.Item
          name="listenerId"
          label={t("workflow_node.deploy.form.tencentcloud_clb_listener_id.label")}
          rules={[formRule]}
          tooltip={<span dangerouslySetInnerHTML={{ __html: t("workflow_node.deploy.form.tencentcloud_clb_listener_id.tooltip") }}></span>}
        >
          <Input placeholder={t("workflow_node.deploy.form.tencentcloud_clb_listener_id.placeholder")} />
        </Form.Item>
      </Show>

      <Show when={fieldResourceType === RESOURCE_TYPE_SSLDEPLOY}>
        <Form.Item
          name="domain"
          label={t("workflow_node.deploy.form.tencentcloud_clb_snidomain.label")}
          rules={[formRule]}
          tooltip={<span dangerouslySetInnerHTML={{ __html: t("workflow_node.deploy.form.tencentcloud_clb_snidomain.tooltip") }}></span>}
        >
          <Input placeholder={t("workflow_node.deploy.form.tencentcloud_clb_snidomain.placeholder")} />
        </Form.Item>
      </Show>

      <Show when={fieldResourceType === RESOURCE_TYPE_RULEDOMAIN}>
        <Form.Item
          name="domain"
          label={t("workflow_node.deploy.form.tencentcloud_clb_ruledomain.label")}
          rules={[formRule]}
          tooltip={<span dangerouslySetInnerHTML={{ __html: t("workflow_node.deploy.form.tencentcloud_clb_ruledomain.tooltip") }}></span>}
        >
          <Input placeholder={t("workflow_node.deploy.form.tencentcloud_clb_ruledomain.placeholder")} />
        </Form.Item>
      </Show>
    </>
  );
};

export default DeployNodeFormTencentCloudCLBFields;
