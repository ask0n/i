package org.igov.model.action.item;

import org.igov.model.access.AccessServiceRole;
import org.igov.model.core.AbstractEntity;
import org.igov.model.core.Entity;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * Tag of Service
 * User: goodg_000
 * Date: 19.06.2016
 * Time: 20:27
 */
@javax.persistence.Entity
public class ServiceTag extends AbstractEntity {

    @Column
    private String sID;

    @Column
    private String sName_UA;

    @Column
    private String sName_RU;

    @ManyToOne(targetEntity = ServiceTagType.class)
    @JoinColumn(name="nID_ServiceTagType", nullable = false, updatable = false)
    private ServiceTagType serviceTagType;

    public String getsID() {
        return sID;
    }
    public void setsID(String sID) {
        this.sID = sID;
    }

    public String getsName_UA() {
        return sName_UA;
    }
    public void setsName_UA(String sName_UA) {
        this.sName_UA = sName_UA;
    }

    public String getsName_RU() {
        return sName_RU;
    }
    public void setsName_RU(String sName_RU) {
        this.sName_RU = sName_RU;
    }

    public ServiceTagType getServiceTagType() {
        return serviceTagType;
    }
    public void setServiceTagType(ServiceTagType serviceTagType) {
        this.serviceTagType = serviceTagType;
    }
}
