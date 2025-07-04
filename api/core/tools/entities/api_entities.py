from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator

from core.model_runtime.utils.encoders import jsonable_encoder
from core.tools.__base.tool import ToolParameter
from core.tools.entities.common_entities import I18nObject
from core.tools.entities.tool_entities import CredentialType, ToolProviderType


class ToolApiEntity(BaseModel):
    author: str
    name: str  # identifier
    label: I18nObject  # label
    description: I18nObject
    parameters: Optional[list[ToolParameter]] = None
    labels: list[str] = Field(default_factory=list)
    output_schema: Optional[dict] = None


ToolProviderTypeApiLiteral = Optional[Literal["builtin", "api", "workflow"]]


class ToolProviderApiEntity(BaseModel):
    id: str
    author: str
    name: str  # identifier
    description: I18nObject
    icon: str | dict
    label: I18nObject  # label
    type: ToolProviderType
    masked_credentials: Optional[dict] = None
    original_credentials: Optional[dict] = None
    is_team_authorization: bool = False
    allow_delete: bool = True
    plugin_id: Optional[str] = Field(default="", description="The plugin id of the tool")
    plugin_unique_identifier: Optional[str] = Field(default="", description="The unique identifier of the tool")
    tools: list[ToolApiEntity] = Field(default_factory=list)
    labels: list[str] = Field(default_factory=list)

    @field_validator("tools", mode="before")
    @classmethod
    def convert_none_to_empty_list(cls, v):
        return v if v is not None else []

    def to_dict(self) -> dict:
        # -------------
        # overwrite tool parameter types for temp fix
        tools = jsonable_encoder(self.tools)
        for tool in tools:
            if tool.get("parameters"):
                for parameter in tool.get("parameters"):
                    if parameter.get("type") == ToolParameter.ToolParameterType.SYSTEM_FILES.value:
                        parameter["type"] = "files"
        # -------------

        return {
            "id": self.id,
            "author": self.author,
            "name": self.name,
            "plugin_id": self.plugin_id,
            "plugin_unique_identifier": self.plugin_unique_identifier,
            "description": self.description.to_dict(),
            "icon": self.icon,
            "label": self.label.to_dict(),
            "type": self.type.value,
            "team_credentials": self.masked_credentials,
            "is_team_authorization": self.is_team_authorization,
            "allow_delete": self.allow_delete,
            "tools": tools,
            "labels": self.labels,
        }


class ToolProviderCredentialApiEntity(BaseModel):
    id: str = Field(description="The unique id of the credential")
    name: str = Field(description="The name of the credential")
    provider: str = Field(description="The provider of the credential")
    credential_type: CredentialType = Field(description="The type of the credential")
    is_default: bool = Field(
        default=False, description="Whether the credential is the default credential for the provider in the workspace"
    )
    credentials: dict = Field(description="The credentials of the provider")


class ToolProviderCredentialInfoApiEntity(BaseModel):
    supported_credential_types: list[str] = Field(description="The supported credential types of the provider")
    is_oauth_custom_client_enabled: bool = Field(
        default=False, description="Whether the OAuth custom client is enabled for the provider"
    )
    credentials: list[ToolProviderCredentialApiEntity] = Field(description="The credentials of the provider")
