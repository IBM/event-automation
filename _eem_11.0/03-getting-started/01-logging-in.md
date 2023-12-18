---
title: "Logging in"
excerpt: "Log in to your Event Endpoint Management installation."
categories: getting-started
slug: logging-in
toc: true
---

Follow the instructions to log in and log out of the {{site.data.reuse.eem_name}} UI.

**Important:** To log into the {{site.data.reuse.eem_name}} UI, a cluster administrator must configure access and role rights by following the instructions in [managing access](../../security/managing-access/) and [managing roles](../../security/user-roles/).

## Logging in

To log in to the {{site.data.reuse.eem_name}} UI, follow the steps:

1. Enter the URL provided by your cluster administrator in a supported [web browser](../../installing/prerequisites/#event-endpoint-management-ui).
2. Log in to your {{site.data.reuse.eem_name}} UI. Use your credentials provided by your cluster administrator.

As a cluster administrator, you can retrieve the URLs and log in to {{site.data.reuse.eem_name}} UI as follows.

## Retrieving the URLs

{{site.data.reuse.eem_name}} uses OpenShift routes for access to its UI. Find out how to retrieve the URL for your {{site.data.reuse.eem_name}} UI to log in to your {{site.data.reuse.eem_name}} instance.

You can use the {{site.data.reuse.openshift_short}} UI (web console) and CLI to retrieve the login URLs as follows:

### Using {{site.data.reuse.openshift_short}} UI

Use the OpenShift web console to retrieve the URL for your {{site.data.reuse.eem_name}} UI as follows:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Networking** in the navigation on the left, and click **Routes**.
3. Locate the route with the name matching your {{site.data.reuse.eem_name}} instance name. It should look something like: `EEM_INSTANCE_NAME-ibm-eem-manager`. Click into this route and find the server or host address. This is your UI route that you can access to login into {{site.data.reuse.eem_name}}.
4. Log in to your {{site.data.reuse.eem_name}} UI from a supported [web browser](../../installing/prerequisites/#event-processing-ui) and enter the credentials to go to the {{site.data.reuse.eem_name}} homepage.

   A cluster administrator can manage access and role rights by following the instructions in [managing access](../../security/managing-access/) and [managing roles](../../security/user-roles/).

### Using the CLI

To retrieve the URL for your {{site.data.reuse.eem_name}} UI, use the following commands:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command:

   ```shell
   kubectl get eem <instance_name> -n <namespace> -o jsonpath='{'.status.endpoints'}' 
   ```

   The following is an example output, and you use the value associated with the **ui** named endpoint to log in to your UI in a web browser:

   ```shell
   [{"name":"ui","type":"UI","uri":"https://qs-eem-ui.apps.my-cluster.company.com"},{"name":"gateway","type":"API","uri":"https://qs-eem-gateway.apps.my-cluster.company.com"}]%
   ```

3. Enter the address in a web browser. For example:

   ```shell
   https://qs-eem-ui.apps.my-cluster.company.com
   ```

4. Log in to your {{site.data.reuse.eem_name}} UI from a supported [web browser](../../installing/prerequisites/#event-processing-ui) and enter the credentials to go to the {{site.data.reuse.eem_name}} homepage.

A cluster administrator can manage access and role rights by following the instructions in [managing access](../../security/managing-access/) and [managing roles](../../security/user-roles/).

## Logging out

To log out of {{site.data.reuse.ep_name}}:

1. In your UI, click the user icon ![user icon]({{ 'images' | relative_url }}/usericon.svg "Diagram showing more options."){:height="30px" width="15px"} in the upper right of the window.
2. Click **Log out**.
3. Click **Log out** again in the dialog to confirm.