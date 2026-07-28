from fastapi import APIRouter, Depends, HTTPException
from imagekitio import ImageKit
from app.core.config import settings
from app.models.user import User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/imagekit", tags=["ImageKit Integration"])

@router.get("/auth")
def get_imagekit_auth_params(current_user: User = Depends(get_current_user)):
    if not settings.IMAGEKIT_PUBLIC_KEY or not settings.IMAGEKIT_PRIVATE_KEY or not settings.IMAGEKIT_URL_ENDPOINT:
        # Return fallback structure if not fully configured yet
        return {
            "token": "sample-token",
            "expire": 0,
            "signature": "sample-signature",
            "publicKey": settings.IMAGEKIT_PUBLIC_KEY or "not-configured",
            "urlEndpoint": settings.IMAGEKIT_URL_ENDPOINT or "not-configured"
        }
        
    try:
        imagekit = ImageKit(
            public_key=settings.IMAGEKIT_PUBLIC_KEY,
            private_key=settings.IMAGEKIT_PRIVATE_KEY,
            url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
        )
        auth_params = imagekit.get_authentication_parameters()
        auth_params["publicKey"] = settings.IMAGEKIT_PUBLIC_KEY
        auth_params["urlEndpoint"] = settings.IMAGEKIT_URL_ENDPOINT
        return auth_params
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
