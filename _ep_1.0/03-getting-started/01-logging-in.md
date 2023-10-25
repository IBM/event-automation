---
title: "Logging in and Logging out"
excerpt: "Log in to your Event Processing UI."
categories: getting-started
slug: logging-in
toc: true
---

Follow the instructions to log in and log out of the {{site.data.reuse.ep_name}} UI.

## Logging in

To log in to the {{site.data.reuse.ep_name}} UI, follow the steps:

1. Enter the URL provided by your cluster administrator in a supported [web browser](../../installing/prerequisites/#event-processing-ui).
2. Log in to your {{site.data.reuse.ep_name}} UI. Use your credentials provided by your cluster administrator.

As a cluster administrator, you can retrieve the URLs and log in to {{site.data.reuse.ep_name}} UI as follows.

## Retrieving the URLs

{{site.data.reuse.ep_name}} uses OpenShift routes or Kubernetes ingress resources for access to its UI. Find out how to retrieve the URLs for your {{site.data.reuse.ep_name}} UI as a cluster administrator.

You can use the {{site.data.reuse.openshift_short}} web console or CLI to retrieve the login URLs.

### By using the OpenShift web console

Use the OpenShift web console to retrieve the URL for your {{site.data.reuse.ep_name}} UI as follows:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Networking** in the navigation on the left, and click **Routes**.
3. Locate the route with the name matching your {{site.data.reuse.ep_name}} instance name. Click into this route and find the server or host address. This is your UI route that you can access to log into {{site.data.reuse.ep_name}}.
4. Log in to your {{site.data.reuse.ep_name}} UI from a supported [web browser](../../installing/prerequisites/#event-processing-ui) and enter the credentials to go to the {{site.data.reuse.ep_name}} homepage.

   A cluster administrator can manage access and role rights by following the instructions in [managing access](../../security/managing-access/) and [managing roles](../../security/user-roles/).

### By using the CLI

To retrieve the URL for your {{site.data.reuse.ep_name}} UI, use the following commands:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command:

   - On OpenShift:

     ```shell
     oc get routes -n <namespace> -l app.kubernetes.io/name=ibm-eventprocessing
     ```

   - On other Kubernetes platforms:

     ```shell
     kubectl get ingress -n <namespace> -l app.kubernetes.io/name=ibm-eventprocessing
     ```

   The following is an example output of the `oc get routes` command, and you use the value from the **HOST/PORT** column to log in to your UI in a web browser:

   ```sh
   NAME                      HOST/PORT                                                         PATH    SERVICES                 PORT   TERMINATION  WILDCARD
   my-event-processing-ep    my-event-processing-ep-myproject.apps.my-cluster.my-domain.com            my-event-processing-ep   3000   reencrypt     None
   ```

3. Enter the address in a web browser. Add `https://` in front of the **HOST/PORT** value. For example:

   ```sh
   https:/my-event-processing-ep-myproject.apps.my-cluster.my-domain.com/
   ```

4. Log in to your {{site.data.reuse.ep_name}} UI from a supported [web browser](../../installing/prerequisites/#event-processing-ui) and enter the credentials to go to the {{site.data.reuse.ep_name}} homepage.

A cluster administrator can manage access and role rights by following the instructions in [managing access](../../security/managing-access/) and [managing roles](../../security/user-roles/).

## Logging out

To log out of {{site.data.reuse.ep_name}}:

1. In your UI, click the user icon ![user icon]({{ 'images' | relative_url }}/usericon.svg "The user icon."){:height="30px" width="15px"} in the upper right of the window.
2. Click **Log out**.
3. Click **Log out** again in the dialog to confirm.
